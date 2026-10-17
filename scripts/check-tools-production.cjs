const fs = require('node:fs');
const origin = 'https://www.gmt400.pl';
const expectedSha = process.env.GITHUB_SHA || null;
const checks = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
async function read(path) { const response = await fetch(origin + path,{cache:'no-store',headers:{Accept:'application/json'},signal:AbortSignal.timeout(15000)}); return {response,data:await response.json()}; }
async function probe(name,path,status,validate) {
 const row = {name,path,passed:false,checkedAt:new Date().toISOString()};
 try { const {response,data} = await read(path); row.status = response.status; row.passed = response.status === status && Boolean(validate(data)); row.reason = row.passed ? 'response_contract_passed' : 'unexpected_status_or_payload'; } catch (error) { row.reason = 'network_timeout_or_invalid_json'; row.error = error.message; }
 checks.push(row);
}
async function main() {
 let deployedSha = null;
 for (let attempt = 0; attempt < 12; attempt++) {
  try { const {response,data} = await read('/api/status'); deployedSha = response.ok ? data.deployment?.commitSha || null : null; } catch {}
  if (expectedSha && deployedSha === expectedSha) break;
  if (attempt < 11) await sleep(10000);
 }
 checks.push({name:'Deployment SHA matches auditor commit',passed:Boolean(expectedSha && deployedSha === expectedSha),expectedSha,deployedSha,reason:deployedSha === expectedSha && expectedSha ? 'sha_matched' : deployedSha ? 'different_commit_deployed' : 'deployment_sha_unavailable'});
 const approx = (a,b,tolerance=.051) => typeof a === 'number' && Number.isFinite(a) && Math.abs(a-b) <= tolerance;
 await probe('Pressure conversion','/api/units?type=pressure&value=32',200,p => approx(p.output?.value,32*.0689475729,.000001));
 await probe('Polish decimal comma','/api/units?type=length&value=1%2C5',200,p => approx(p.output?.value,1.5*1.609344,.000001));
 await probe('Invalid conversion type','/api/units?type=constructor&value=1',400,p => typeof p.error === 'string');
 await probe('RPO lookup','/api/rpo?q=G80%20Z71',200,p => ['G80','Z71'].every(code => p.results?.some(item => item.code === code)));
 await probe('RPO invalid limit','/api/rpo?q=G80&limit=-1',400,p => typeof p.error === 'string');
 await probe('Polish diagnostic search','/api/diagnostics?q=wypadanie%20zaplonow&system=OBD-II',200,p => p.results?.some(item => item.code === 'P0300'));
 await probe('OBD combined filter','/api/diagnostics?q=P0300&system=OBD-I',200,p => Array.isArray(p.results) && p.results.length === 0);
 await probe('Tire calculation','/api/calculators?tool=tire&width=265&aspect=75&rim=16&oldWidth=235&oldAspect=75&oldRim=16&speed=60&axleRatio=3.73',200,p => approx(p.actualSpeedAtIndicatedSpeed,60*(16*25.4+2*265*.75)/(16*25.4+2*235*.75)));
 await probe('Negative tire speed rejected','/api/calculators?tool=tire&width=265&aspect=75&rim=16&speed=-1',400,p => typeof p.error === 'string');
 await probe('Gear ratio','/api/calculators?tool=gear-ratio&tireDiameterInches=31.6&engineRpm=2000&transmissionRatio=1&axleRatio=3.73',200,p => approx(p.speedMph,2000*31.6/(3.73*336.13)));
 await probe('Compression ratio','/api/calculators?tool=compression-ratio&cylinderVolumeCc=716&combustionChamberCc=64',200,p => approx(p.compressionRatio,780/64,.0051));
 await probe('1999 Suburban 2WD catalog links','/api/parts?model=Suburban%201500&year=1999&engine=5.7L%20V8&drivetrain=2wd',200,p => p.coverage?.completePartsCatalog === false && p.externalCatalogs?.length === 1 && p.externalCatalogs[0].drivetrain === '2wd');
 const catalogs = [
  ['FRAM air filter catalog','https://www.fram.com/engine-air-filters/chevrolet/k1500-suburban/1999'],
  ['Summit WIX oil filter catalog','https://www.summitracing.com/search/brand/wix-filters/part-type/oil-filters/year/1999/make/chevrolet/model/k1500-suburban/engine-size/5-7l-350'],
  ['RockAuto oil filter catalog','https://www.rockauto.com/en/catalog/chevrolet,1999,c1500+suburban,5.7l+v8,1352988,engine,oil+filter,5340']
 ];
 for (const [name,url] of catalogs) {
  const row = {name,url,passed:false,scope:'HTTP HTML availability only, not verified fitment'};
  try { const response = await fetch(url,{headers:{Accept:'text/html'},signal:AbortSignal.timeout(20000)}); row.status = response.status; row.finalUrl = response.url; const html = await response.text(); row.passed = response.ok && /text\/html/i.test(response.headers.get('content-type') || '') && html.length > 100 && !/access denied|verify you are human|captcha challenge/i.test(html); row.reason = row.passed ? 'html_available_not_fitment_verified' : 'catalog_availability_not_confirmed'; } catch (error) { row.reason = 'catalog_network_or_timeout'; row.error = error.message; }
  checks.push(row);
 }
 const report = {auditorCodeSha:expectedSha,deployedSha,runId:process.env.GITHUB_RUN_ID || null,checkedAt:new Date().toISOString(),origin,passed:checks.length === 16 && checks.every(row => row.passed),scope:'Public live API response contracts and three catalog HTTP checks. No VIN, Notion credentials or authentication tokens. Not browser interaction, real iPhone, all variants or guaranteed catalog fitment.',checks};
 fs.mkdirSync('.diagnostics',{recursive:true}); fs.writeFileSync('.diagnostics/tools-production-report.json',JSON.stringify(report,null,2)+'\n');
 if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'### Live tools diagnostics\n'+checks.map(row => '- '+(row.passed ? 'PASS' : 'NOT VERIFIED')+': '+row.name+' — '+row.reason).join('\n')+'\n');
 if (!report.passed) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });

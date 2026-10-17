// Trigger live material verification after production deployment.
const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({testDir:'./tests',testMatch:'production-material-live.spec.cjs',workers:1,retries:0,timeout:120000,expect:{timeout:15000},use:{viewport:{width:390,height:844},trace:'retain-on-failure',screenshot:'only-on-failure'},projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'webkit',use:{browserName:'webkit',isMobile:true,hasTouch:true}}]});

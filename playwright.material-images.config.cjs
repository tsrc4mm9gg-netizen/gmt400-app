// Trigger material image verification after production deployment.
const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({testDir:'./tests',testMatch:['material-images.spec.cjs','notion-content.spec.cjs'],workers:1,retries:0,timeout:45000,expect:{timeout:10000},use:{viewport:{width:390,height:844},trace:'retain-on-failure',screenshot:'only-on-failure'},projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'webkit',use:{browserName:'webkit',isMobile:true,hasTouch:true}}]});

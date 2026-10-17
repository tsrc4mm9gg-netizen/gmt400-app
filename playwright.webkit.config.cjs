const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
 testDir:'./tests',
 testMatch:['vehicle-filters.spec.cjs','global-search.spec.cjs','knowledge-categories.spec.cjs','navigation.spec.cjs','navigation-polish.spec.cjs','diy-restoration.spec.cjs','notion-pagination.spec.cjs','notion-content.spec.cjs','new-tools.spec.cjs','parts-api.spec.cjs','maintenance-api.spec.cjs','tools-audit.spec.cjs'],
 timeout:45000, expect:{ timeout:10000 }, workers:1, retries:0,
 use:{ browserName:'webkit', viewport:{ width:390,height:844 }, deviceScaleFactor:2, isMobile:true, hasTouch:true, trace:'retain-on-failure', screenshot:'only-on-failure' }
});

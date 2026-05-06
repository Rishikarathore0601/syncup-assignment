// Module load test — verifies all require() chains resolve without errors
// Does NOT start the server or connect to any external services
'use strict';

const path = require('path');
const root = path.join(__dirname, '..');
const r = (p) => require(path.join(root, p));

console.log('🔍 Testing module load chain...\n');

const tests = [
  // Config
  { name: 'config/env',            load: () => r('src/config/env') },
  { name: 'config/cloudinary',     load: () => r('src/config/cloudinary') },
  { name: 'utils/constants',       load: () => r('src/utils/constants') },
  { name: 'utils/responseHandler', load: () => r('src/utils/responseHandler') },
  { name: 'utils/logger',          load: () => r('src/utils/logger') },

  // Middlewares
  { name: 'middlewares/auth',       load: () => r('src/middlewares/auth.middleware') },
  { name: 'middlewares/error',      load: () => r('src/middlewares/error.middleware') },
  { name: 'middlewares/validation', load: () => r('src/middlewares/validation.middleware') },

  // Validators
  { name: 'auth/validator',         load: () => r('src/modules/auth/auth.validator') },
  { name: 'jobs/validator',         load: () => r('src/modules/jobs/job.validator') },
  { name: 'applications/validator', load: () => r('src/modules/applications/application.validator') },

  // Models
  { name: 'models/User',        load: () => r('src/modules/users/user.model') },
  { name: 'models/Job',         load: () => r('src/modules/jobs/job.model') },
  { name: 'models/Application', load: () => r('src/modules/applications/application.model') },

  // Services
  { name: 'services/auth',         load: () => r('src/modules/auth/auth.service') },
  { name: 'services/job',          load: () => r('src/modules/jobs/job.service') },
  { name: 'services/application',  load: () => r('src/modules/applications/application.service') },
  { name: 'services/upload',       load: () => r('src/modules/upload/upload.service') },
  { name: 'services/ai',           load: () => r('src/modules/ai/ai.service') },
  { name: 'services/user',         load: () => r('src/modules/users/user.service') },

  // Controllers
  { name: 'controllers/auth',        load: () => r('src/modules/auth/auth.controller') },
  { name: 'controllers/job',         load: () => r('src/modules/jobs/job.controller') },
  { name: 'controllers/application', load: () => r('src/modules/applications/application.controller') },
  { name: 'controllers/upload',      load: () => r('src/modules/upload/upload.controller') },
  { name: 'controllers/user',        load: () => r('src/modules/users/user.controller') },
  { name: 'controllers/ai',          load: () => r('src/modules/ai/ai.controller') },

  // Routes
  { name: 'routes/auth',         load: () => r('src/modules/auth/auth.routes') },
  { name: 'routes/jobs',         load: () => r('src/modules/jobs/job.routes') },
  { name: 'routes/applications', load: () => r('src/modules/applications/application.routes') },
  { name: 'routes/upload',       load: () => r('src/modules/upload/upload.routes') },
  { name: 'routes/users',        load: () => r('src/modules/users/user.routes') },
  { name: 'routes/ai',           load: () => r('src/modules/ai/ai.routes') },

  // Sockets
  { name: 'sockets/socket', load: () => r('src/sockets/socket') },

  // App factory (wires everything together)
  { name: 'src/app', load: () => r('src/app') },
];

let passed = 0;
let failed = 0;

for (const { name, load } of tests) {
  try {
    load();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌  ${name}`);
    console.error(`     └─ ${err.message}`);
    failed++;
  }
}

console.log('\n' + '='.repeat(55));
console.log(`  Module Load Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(55));

if (failed > 0) {
  console.error('\n  ⚠️  Fix the errors above before starting the server.');
  process.exit(1);
} else {
  console.log('\n  🎉  ALL MODULES LOADED SUCCESSFULLY');
  console.log('  ✅  Run "npm run dev" to start the server.\n');
}

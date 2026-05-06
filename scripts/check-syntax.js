const { execSync } = require('child_process');
const path = require('path');

const files = [
  'server.js',
  'src/app.js',
  'src/config/env.js',
  'src/config/db.js',
  'src/config/redis.js',
  'src/config/cloudinary.js',
  'src/utils/logger.js',
  'src/utils/responseHandler.js',
  'src/utils/constants.js',
  'src/middlewares/auth.middleware.js',
  'src/middlewares/error.middleware.js',
  'src/middlewares/validation.middleware.js',
  'src/modules/users/user.model.js',
  'src/modules/jobs/job.model.js',
  'src/modules/applications/application.model.js',
  'src/modules/auth/auth.service.js',
  'src/modules/jobs/job.service.js',
  'src/modules/applications/application.service.js',
  'src/modules/upload/upload.service.js',
  'src/modules/ai/ai.service.js',
  'src/modules/users/user.service.js',
  'src/modules/auth/auth.controller.js',
  'src/modules/jobs/job.controller.js',
  'src/modules/applications/application.controller.js',
  'src/modules/upload/upload.controller.js',
  'src/modules/users/user.controller.js',
  'src/modules/ai/ai.controller.js',
  'src/modules/auth/auth.validator.js',
  'src/modules/jobs/job.validator.js',
  'src/modules/applications/application.validator.js',
  'src/modules/auth/auth.routes.js',
  'src/modules/jobs/job.routes.js',
  'src/modules/applications/application.routes.js',
  'src/modules/upload/upload.routes.js',
  'src/modules/users/user.routes.js',
  'src/modules/ai/ai.routes.js',
  'src/sockets/socket.js',
];

let passed = 0;
let failed = 0;
const errors = [];

for (const file of files) {
  try {
    execSync(`node --check "${file}"`, { stdio: 'pipe' });
    console.log(`  ✅  ${file}`);
    passed++;
  } catch (err) {
    const msg = err.stderr ? err.stderr.toString().trim() : err.message;
    console.error(`  ❌  ${file}\n     ${msg}`);
    errors.push({ file, msg });
    failed++;
  }
}

console.log('\n' + '='.repeat(55));
console.log(`  Syntax Check Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(55));

if (failed > 0) {
  console.error('\nFailed files:');
  errors.forEach(({ file, msg }) => console.error(`  - ${file}: ${msg.split('\n')[0]}`));
  process.exit(1);
} else {
  console.log('\n  🎉  ALL FILES PASSED SYNTAX CHECK');
}

// gulpfile.js
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const shell = require('gulp-shell');

// Task to start the backend using nodemon
function startBackend(cb) {
  nodemon({
    script: 'backend/src/app.js',
    watch: ['backend/src/**/*.*'],
    ext: 'js'
  });
  cb();
}

// Task to start the frontend development server (Create React App)
function startFrontend(cb) {
  shell.task('npm start --prefix frontend')();
  cb();
}

// Dev task to run both backend and frontend concurrently
exports.dev = gulp.parallel(startBackend, startFrontend);

// Optional build task for the frontend
function buildFrontend(cb) {
  shell.task('npm run build --prefix frontend')();
  cb();
}
exports.build = gulp.series(buildFrontend);

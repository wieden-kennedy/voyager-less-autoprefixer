var autoprefixer = require('gulp-autoprefixer')
  , csso = require('gulp-csso')
  , fs = require('fs')
  , less = require('gulp-less')
  , path = require('path')
  , plumber = require('gulp-plumber');

module.exports = function (voyager) {
  
  var browsers = [
    'ie >= 9'
  , 'ie_mob >= 9'
  , 'ff >= 30'
  , 'chrome >= 34'
  , 'safari >= 7'
  , 'opera >= 23'
  , 'ios >= 7'
  , 'android >= 4.4'
  , 'bb >= 10'
  ]; 

  if (fs.existsSync(path.join(voyager.CWD, 'package.json'))) {
    var pkg = JSON.parse(fs.readFileSync(path.join(voyager.CWD, 'package.json')));
    if (pkg.autoprefixer) {
      browsers = pkg.autoprefixer;
    }
  }

  voyager.task('write', 'styles', function (done) {
    this.src('stylesheets/main.less')
      .pipe(plumber())
      .pipe(less())
      .pipe(autoprefixer(browsers, { cascade: true }))
      .pipe(this.out('stylesheets'))
      .on('end', done);
  });

  voyager.task('write', 'styles-vendor', function (done) {
    this.src('stylesheets/vendor/**')
      .pipe(this.out('stylesheets/vendor'))
      .on('end', done);
  });

  voyager.task('build', 'styles', function (done) {
    this.src(['stylesheets/**/*.css', '!stylesheets/vendor/**'])
      .pipe(csso())
      .pipe(this.out('stylesheets'))
      .on('end', done);
  });

  voyager.task('build', 'styles-vendor', function (done) {
    this.src('stylesheets/vendor/**')
      .pipe(this.out('stylesheets/vendor'))
      .on('end', done);
  });

  voyager.cancelWatch('stylesheets/**/*.css');
  voyager.watch(['stylesheets/**/*.less', '!stylesheets/vendor/**'], 'styles');
};

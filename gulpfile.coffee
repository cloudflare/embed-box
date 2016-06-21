fs = require('fs')
Path = require('path')
es = require('event-stream')
browserify = require('browserify')
source = require('vinyl-source-stream')
uglify = require('gulp-uglify')

gulp = require('gulp')
gutil = require('gulp-util')
bower = require('gulp-bower')
buffer = require('gulp-buffer')
concat = require('gulp-concat')
coffee = require('gulp-coffee')
replace = require('gulp-replace')
jade = require('gulp-jade')
stylus = require('gulp-stylus')
nib = require('nib')

html2string = require('gulp-html2string')
rename = require('gulp-rename')

{buildPage, pageCompiler} = require('./tools/build')

gulp.task 'bower', ->
  bower()
    .pipe(gulp.dest('bower_components/'))

gulp.task 'bundle', ['bower'], ->
  gulp.src("./pages/*")
    .pipe(es.mapSync(buildPage))

gulp.task 'templates', ->
  gulp.src('pages/*/*.html')
    .pipe(html2string({
      base: Path.join(__dirname, 'html')
      createObj: true
      objName: '__UNIVERSAL_EMBED_TEMPLATES'
    }))
    .pipe(rename({extname: '.js'}))
    .pipe(gulp.dest('js/templates'))

gulp.task 'pages', ['bundle'], ->
  gulp.src("./pages/*")
    .pipe(es.through(pageCompiler(uncss: false)))

gulp.task 'browserify', ->
  for file in ['index']
    browserify({
      entries: ["./coffee/#{ file }.coffee"]
      extensions: ['.coffee']
    })
      .bundle()
      .pipe(source("#{ file }.js"))
      .pipe(buffer())
      .pipe(replace(/(typeof define === 'function' && define.amd)/g, '(false)'))
      .pipe(uglify())
      .pipe(gulp.dest('./js'))

gulp.task 'tests', ->
  browserify({
    entries: ['./test/tests.coffee']
    extensions: ['.coffee']
  })
    .bundle()
    .pipe(source('tests.js'))
    .pipe(gulp.dest('./js'))

gulp.task 'watch', ->
  gulp.watch './styl/**', ['pages']

  gulp.watch './pages/*/{jade,coffee,styl}/*', ['pages']
  gulp.watch './jade/*', ['pages']
  gulp.watch './bower_components/ui/{jade,styl}/*', ['pages']

  gulp.watch './coffee/**', ['browserify']
  gulp.watch './**/*.coffee', ['tests']

  gulp.watch './pages/**/*.html', ['templates']

gulp.task 'build', ['pages', 'browserify', 'tests', 'templates']
gulp.task 'default', ['build', 'watch']

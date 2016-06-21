Path = require('path')
gulp = require('gulp')
gutil = require('gulp-util')
jade = require('gulp-jade')
stylus = require('gulp-stylus')
nib = require('nib')
concat = require('gulp-concat')
es = require('event-stream')
uglify = require('gulp-uglify')
coffee = require('gulp-coffee')
uncss = require('gulp-uncss')
minifyCSS = require('gulp-minify-css')

REPLACES =
  style:
    key: 'STYLES'
    pattern: "<style>\n%s\n</style>"
  script:
    key: 'SCRIPTS'
    pattern: "<script>\n%s\n</script>"

STYLUS_OPTS =
  use: [nib()]
  paths: [
    process.cwd(),
    Path.join(process.cwd(), 'bower_components')
  ]

handleError = (err) ->
  gutil.log err
  gutil.beep()

  @emit 'end'

content = {}
save = (type, folder, data) ->
  content[folder] ?= {}
  content[folder][type] ?= ''
  content[folder][type] += "\n#{ data.contents }\n"

buildPage = (folder) ->
rewriteIncludes = (folder) ->
  es.mapSync (file) ->
    str = file.contents.toString()

    for type, {key, pattern} of REPLACES when content[folder][type]?
      insertText = pattern.replace('%s', content[folder][type])
      str = str.replace("<!-- #{ key } -->", insertText)

    content[folder] = {}

    file.contents = new Buffer(str, 'utf8')

    return file

pageCompiler = (options={}) ->
  (folder) ->
    gulp.src(["#{ folder.path }/jade/*.jade", "#{ folder.path }/jade/**/*.jade"])
      .pipe(jade())
        .on('error', handleError)
      .pipe es.map (file, cb) ->
        html = file.contents.toString('utf8')

        s1 = gulp.src("#{ folder.path }/styl/*.styl")
          .pipe(stylus(STYLUS_OPTS))
            .on('error', handleError)
          .pipe(concat('temp'))

        if options.uncss isnt false
          s1 = s1.pipe(uncss({html}))

        s1 = s1.pipe(minifyCSS({compatibility: 'ie8'}))
          .pipe(es.mapSync(save.bind(null, 'style', folder.path)))

        s2 = gulp.src("#{ folder.path }/coffee/*.coffee")
          .pipe(coffee())
            .on('error', handleError)
          .pipe(concat('temp'))
          .pipe(uglify())
          .pipe(es.mapSync(save.bind(null, 'script', folder.path)))

        es.merge(s1, s2).on 'end', ->
          cb(null, file)

      .pipe(rewriteIncludes(folder.path))
      .pipe(gulp.dest(folder.path))

compilePage = pageCompiler()

module.exports = {buildPage, compilePage, pageCompiler, rewriteIncludes, handleError}

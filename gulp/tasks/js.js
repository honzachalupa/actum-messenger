/* Environment */
const DEVELOPMENT = require('../environment').isDevelopment;
const PRODUCTION = !DEVELOPMENT;

/* Plugins */
const gulp = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const uglifyify = require('uglifyify');
const envify = require('envify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const browserSync = require('browser-sync');
const config = require('../config');

/* Paths */
// const { src, dist } = config.paths;
const src = config.paths.src;
const dist = config.paths.dist;
const names = config.names;

const bundle = () => {
    const transforms = [envify, babelify];
    const opts = {
        entries: src.app.entry,
        debug: DEVELOPMENT,
        transform: DEVELOPMENT ? transforms : [...transforms, uglifyify]
    };
    const bundler = DEVELOPMENT ? watchify(browserify(Object.assign({}, watchify.args, opts))) : browserify(opts);
    const rebundle = () => {
        return bundler.bundle()
            .on('error', e => gutil.log(gutil.colors.red(e.name) + e.message.substr(e.message.indexOf(': ') + 1)))
            .pipe(source(names.js.src))
            .pipe(buffer())
            .pipe(gulpif(DEVELOPMENT, sourcemaps.init({ loadMaps: true })))
            .pipe(gulpif(DEVELOPMENT, sourcemaps.write('./')))
            .pipe(gulp.dest(dist.js))
            .pipe(gulpif(DEVELOPMENT, browserSync.stream()))
            .pipe(gulpif(PRODUCTION, uglify()))
            .pipe(gulpif(PRODUCTION, rename(names.js.min)))
            .pipe(gulpif(PRODUCTION, gulp.dest(dist.js)));
    };
    bundler
        .on('update', rebundle)
        .on('log', gutil.log);
    return rebundle();
};

gulp.task('js', ['eslint'], bundle);

/**
 * Created by zhijie.huang on 2017/9/15.
 */
const gulp = require('gulp');
const babel = require('gulp-babel');

const ENTRY_PATH = 'src/eventCenter.js';
const OUT_PATH = 'dist';

gulp.task('default', () => {
    gulp.start('babel');
});

gulp.task('babel', () => {
    return gulp.src(ENTRY_PATH)
        .pipe(babel())
        .pipe(gulp.dest(OUT_PATH));
});

gulp.task('watch', () => {
    gulp.watch(ENTRY_PATH, ['babel']);
});
/**
 * Created by zhijie.huang on 2017/9/15.
 */
const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () => {
    return gulp.src('src/eventCenter.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});
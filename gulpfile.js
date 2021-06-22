var gulp = require('gulp'),
    
    del    = require('del'),//Подключаем библиотеку для удаления файлов и папок
    cache = require('gulp-cache'), //Кеширование изображений
    imagemin = require('gulp-imagemin');// Сжатие изображение
    cssnano = require("gulp-cssnano"), // Минимизация CSS
    autoprefixer = require('gulp-autoprefixer'), // Проставлет вендорные префиксы в CSS для поддержки старых браузеров
    concat = require("gulp-concat"), // Объединение файлов - конкатенация
    uglify = require("gulp-uglify"), // Минимизация javascript
    rename = require("gulp-rename"); // Переименование файлов


//Копирование файлов php html json log из папки app
gulp.task("copy", function () {
    return gulp.src ("app/**/*.+(html|php|json|log)")
            .pipe (gulp.dest("dist/"))
});
//Копирование htaccess с использованием дополнительнной опции dot:true
gulp.task("htaccess", function () {
    return gulp.src ("app/.htaccess", { dot: true })
            .pipe (gulp.dest("dist/"))
});

//Копирование файлов и папок из папки vendor
gulp.task("vendors", function () {
    return gulp.src ("app/vendor/**/*")
            .pipe (gulp.dest("dist/vendor/"))
});

//Копируем шрифты
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

//Оптимизация css
gulp.task("css", function () {
   return gulp.src("app/css/**/*.css")
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist/css")); 
});

//Оптимизация js
gulp.task("scripts", function() {
    return gulp.src("app/js/*.js") // директория откуда брать исходники
        .pipe(concat('main.js')) // объеденим все js-файлы в один 
        .pipe(uglify()) // вызов плагина uglify - сжатие кода
        .pipe(rename({ suffix: '.min' })) // вызов плагина rename - переименование файла с приставкой .min
        .pipe(gulp.dest("dist/js")); // директория продакшена, т.е. куда сложить готовый файл
});


//Оптимизация и копирование изображений
gulp.task("images", function() {
    return gulp.src("app/img/**/*.+(png|jpeg|jpg|svg|gif|ico)")
            .pipe(cache(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true
            })))
            .pipe(gulp.dest("dist/images"))
});

//Оптимизация и копирование изображений проектов loft
gulp.task("images_projects", function() {
    return gulp.src("app/loft_projects/**/*.+(png|jpeg|jpg|svg|gif|ico)")
            .pipe(cache(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true
            })))
            .pipe(gulp.dest("dist/loft_projects"))
});


//Следить за изменениями в файлах
gulp.task ("watcher", function () {
    gulp.watch('app/**/*.+(html|php|json|log)',   gulp.parallel('copy'));
    gulp.watch("app/vendor/**/*",  gulp.parallel('vendors'));
    gulp.watch("app/fonts/**/*",  gulp.parallel('fonts'));
    gulp.watch("app/img/**/*.+(png|jpeg|jpg|svg|gif|ico)",  gulp.parallel('images'));
    gulp.watch("app/loft_projects/**/*.+(png|jpeg|jpg|svg|gif|ico)",  gulp.parallel('images_projects'));
    gulp.watch("app/css/**/*.css", gulp.parallel("css"));
    gulp.watch("app/js/**/*.js", gulp.parallel("scripts"));
});

//Для удаления папки dist перед сборкой
gulp.task("del", function () {
   return del('dist'); // Удаляем папку dist перед сборкой 
});

//Очистка кеша
gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task("default", gulp.parallel("copy", "htaccess", "vendors", "images", "images_projects", "fonts","css","scripts", "watcher"));
gulp.task("build", gulp.series("del", "clear", "copy", "htaccess", "vendors", "images", "images_projects", "fonts","css","scripts"));



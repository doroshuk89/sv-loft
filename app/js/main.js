
(function ($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div class="cp-spinner cp-meter"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 1000);
    });



    /*[ Fixed Header ]
    ===========================================================*/
    var header = $('header');
    var logo = $(header).find('.logo img');
    var linkLogo1 = $(logo).attr('src');
    var linkLogo2 = $(logo).data('logofixed');

    $(window).on('scroll',function(){
        if($(this).scrollTop() > 5) {
            $(header).addClass('header-fixed');
        }
        else {
            $(header).removeClass('header-fixed');
        }
    });

    /*[ Show/hide sidebar ]
    ===========================================================*/
    $('body').append('<div class="overlay-sidebar trans-0-4"></div>');
    var ovlSideBar = $('.overlay-sidebar');
    var btnShowSidebar = $('.btn-show-sidebar');
    var btnHideSidebar = $('.btn-hide-sidebar');
    var sidebar = $('.sidebar');

    $(btnShowSidebar).on('click', function(){
        $(sidebar).addClass('show-sidebar');
        $(ovlSideBar).addClass('show-overlay-sidebar');
        $('body').addClass('body-open');
    })

    $(btnHideSidebar).on('click', function(){
        $(sidebar).removeClass('show-sidebar');
        $(ovlSideBar).removeClass('show-overlay-sidebar');
        $('body').removeClass('body-open');
    })

    $(ovlSideBar).on('click', function(){
        $(sidebar).removeClass('show-sidebar');
        $(ovlSideBar).removeClass('show-overlay-sidebar');
        $('body').removeClass('body-open');
    })

    //Скрыть меню при переходам по ссылкам якорям
    $('.sidebar li a.txt19').on ('click', function () {
        $(sidebar).removeClass('show-sidebar');
        $(ovlSideBar).removeClass('show-overlay-sidebar');
        $('body').removeClass('body-open');
    })

    /*[ Isotope ]
    ===========================================================*/
    var $topeContainer = $('.isotope-grid');
    var $filter = $('.filter-tope-group');

    // filter items on button click
    $filter.each(function () {
        $filter.on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $topeContainer.isotope({filter: filterValue});
        });
        
    });

    // init Isotope
    $(window).on('load', function () {
        var $grid = $topeContainer.each(function () {
            $(this).isotope({
                itemSelector: '.isotope-item',
                percentPosition: true,
                animationEngine : 'best-available',
                masonry: {
                    columnWidth: '.isotope-item'
                }
            });
        });
    });

    var labelGallerys = $('.label-gallery');

    $(labelGallerys).each(function(){
        $(this).on('click', function(){
            for(var i=0; i<labelGallerys.length; i++) {
                $(labelGallerys[i]).removeClass('is-actived');
            }

            $(this).addClass('is-actived');
        });
    });

    /*Smooth scroll */
    $('.menu a, .menu-sidebar a').on('click', function (e) {
        e.preventDefault();
            let href = $(this).attr('href');
        if(href != '#') {
            let top = $(href).offset().top;
            $('html, body').animate(
                {
                    scrollTop: top
                },
                {
                    duration: 1000,   // по умолчанию «400»
                    easing: "swing" // по умолчанию «swing»
                });
        }
    });

    /*ScrollSpy js simple
    ================================================ */
    //get Anchor link, create array
        var anchorLink = Array ();
        $('section, body').each(function (i) {
            let id = $(this).attr('id');
                if (id) {
                            anchorLink.push(id);
                        }
            });

    function scrollSpy() {
            let current;
            for (let i = 0; i < anchorLink.length; i++) {
                if ( $('#'+anchorLink[i]).offset().top - 110 <= $(window).scrollTop() ) {
                    current = anchorLink[i];
                }
            }
        $("nav a[href='#"+current+"'] , .menu-sidebar a[href='#"+current+"']").addClass('active');
        $("nav a, .menu-sidebar a").not("a[href='#"+current+"']").removeClass('active');
    }
    //scrollSpy call
    $(document).ready( function() {
        scrollSpy();
    });

    $(window).on('scroll', function() {
            scrollSpy();
    });

/* =======================================================*/

/* MaskInputPhone*/
/* ===================================================== */
    $('.phone').mask("+375 (99) 999-99-99");
/* ===================================================== */
/* Botton for Clear input form */
    $('#clear_order, #clear').on('click', function (e) {
            e.preventDefault();
            
            var currentForm = $(this).closest('.modal-content').find('.contact-form');
            if(currentForm){
                (currentForm)[0].reset();
                
                //Удаление классов валидации     
                currentForm.find('input, textarea').each(function(){
                        $(this).removeClass('has-error has-success');
                    });
            }
    })
/* Validate form for Modal Window*/
/* ===================================================== */
    $('.contact-form').validate({
        onfocusout: false,
        onkeyup: false,
        rules: {
            name:{
                required:true,
                minlength: 2
            },
            email:{
                required:true,
                email: true,
                minlength: 2
            },
            message:{
                required:true,
                minlength: 2
            },
        },
        errorPlacement: function (error, element) {},
        errorClass: "has-error",
        validClass: "has-success",
        highlight: function (element, errorClass, validClass ) {
            $(element)
                .closest('.form-control')
                .removeClass(validClass)
                .addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element)
                .closest('.form-control')
                .removeClass(errorClass)
                .addClass(validClass);
        }
    });

    //Форма обратной связи в модальном окне
    $('#exp').on('click', function (e) {
        e.preventDefault();
        let form = $(this).closest('.modal-content').find('.contact-form');
        let formData = new FormData();
        if(form.valid()){
           form.find('input, textarea').each(function () {
               formData.append($(this).attr('name'), $(this).val());
           })
           formData.append("id_form", form.attr('id'));
            ajaxDataTransfer(form, formData);
        }
    });

/* ===================================================== */

/* Validate form for IndexPage*/
/* ===================================================== */
    $('.wrap-form-reservation').validate({
        onfocusout: false,
        onkeyup: false,
        rules: {
            name:{
                required:true,
                minlength: 2
            },
            email:{
                required:true,
                email: true,
                minlength: 2
            },
            phone:{
                required:true,
                minlength: 9
            },
            message:{
                required:true,
                minlength: 2
            },
        },
        errorPlacement: function (error, element) {},
        errorClass: "has-error",
        validClass: "has-success",
        highlight: function (element, errorClass, validClass ) {
            $(element)
                .closest('div, textarea')
                .removeClass(validClass)
                .addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element)
                .closest('div, textarea')
                .removeClass(errorClass)
                .addClass(validClass);
        }
    });

//форма контактов на странице
$('.wrap-form-reservation').on('submit', function (e) {
            e.preventDefault();
            let form = $(this);
            let formData = new FormData();
            if(form.valid()){
                form.find('input, textarea').each(function () {
                    formData.append($(this).attr('name'), $(this).val());
                });
                formData.append("id_form", form.attr('id'));
                ajaxDataTransfer(form, formData);
            }
        return false;
    });

/* ===================================================== */

/* Обработчик клика по кнопке Заказать Открытие модального окна через js*/
$('.orderLoft').on('click', function(e){
    e.preventDefault();
    var itus = $(this);
    var titleOrder;
    itus.closest('.gallery-case').find('.click-project-loft').each(function () {
        titleOrder=$(this).html();
    })
        if(titleOrder) {
            $('#nameLoftOrder').html(titleOrder);
        }
    $("#orderModalForm").modal('show');
})
/* ===================================================== */

/* Jquery Validate */
	$('#OrderLoftForm').validate({
		rules: {
			name:{
				required:true,
				minlength: 2
			},
			phone:{
				required:true,
				minlength: 19
			},
		},
		errorPlacement: function (error, element) {},
                errorClass: "has-error",
                validClass: "has-success",
                highlight: function (element, errorClass, validClass ) {
                        $(element)
                            .closest('.form-control')
                            .removeClass(validClass)
                            .addClass(errorClass);
                    },
                unhighlight: function (element, errorClass, validClass) {
                        $(element)
                            .closest('.form-control')
                            .removeClass(errorClass)
                            .addClass(validClass);
                    },
		submitHandler: function(form) {
			dataFormAjax(form);
		}
	});

    function dataFormAjax (form) {
                let formData = new FormData();
                    $(form).find('input').each(function () {
                        formData.append($(this).attr('name'), $(this).val());
                    });
                    formData.append("id_form", $(form).attr('id'));
                    formData.append('nameOrder', $('#nameLoftOrder').html());
        ajaxDataTransfer($(form), formData);
    }   
   
   
/* jquery function transmission data on form*/
    function ajaxDataTransfer (form, formdata) {
        let uri = "/scripts/notify.php";
        $.ajax ({
            type: 'POST',
            url:uri,
            contentType: false,
            processData: false,
            data:formdata,
            timeout: 5000,
            //Указывая тип json использовать функцию JSON.parse не надо будет ошибка
            dataType: "json",
            beforeSend: function (data) {
                //Блокируем кнопку и элементы формы
                form.find('button, input, textarea').attr('disabled', 'disabled');
            },
            success:  function (data) {
                if(data) {
                    //Если ошибок нет, очищаем форму
                    if(data.status == true){
                        //Очистка формы
                        form[0].reset();
                        //Включение кнопки и элементов формы
                        form.find('button, input, textarea').removeAttr('disabled');
                        form.find('.has-success').removeClass('has-success');
                            form.find("p.msg").html(data.message);
                            form.find("p.msg").addClass("msg-success").fadeIn("slow");
                            setTimeout(function () {
                                //Если форма в модально окне, закрываем модальное окно при успехе
                                if (form.closest('#feedBackForm, #orderModalForm').hasClass('modal')) {
                                    form.closest('#feedBackForm, #orderModalForm').modal( 'hide' );
                                }
                            $('p.msg').fadeOut("slow").removeClass('msg-success').val("");
                        }, 3000);
                    }else {
                        //Включение кнопки и элементов формы
                        form.find('button,input, textarea').removeAttr('disabled');
                        form.find('.has-success').removeClass('has-success');
                            form.find("p.msg").html(data.message);
                            form.find("p.msg").addClass("msg-error").fadeIn("slow");
                        setTimeout(function () {
                            $('p.msg').fadeOut("slow").removeClass('msg-error').val("");
                        },2000);
                    }
                }
            },
            error: function(x, t, e){
                if( t === 'timeout') {
                    // Произошел тайм-аут
                    //Очистка формы
                    form[0].reset();
                    //Включение кнопки и элементов формы
                    form.find('button,input, textarea').removeAttr('disabled');
                    form.find('.has-success').removeClass('has-success');
                        form.find("p.msg").html('Превышено время ожидания');
                        form.find("p.msg").addClass("msg-error").fadeIn("slow");
                    setTimeout(function() { $('p.msg').fadeOut("slow").removeClass('msg-error').val(""); }, 3000);
                }
            }
        })
    }

//Jquery LightGallery simple
$('.wrap-gallery-footer, .wrap-gallery-sidebar').lightGallery({
    thumbnail:true
}); 
//Jquery LightGallery with Isotope
$('.click-full-image').on('click', function(e) {
    e.preventDefault();
    var img_links = [];
    
    var arr = new Map([
                                ['img_full', $(this).data('href')],
                                ['img_thumb',$(this).closest('.item-gallery').find('img').attr('src')],
                                ['title', '<h4>Мебель в стиле ЛОФТ</h4>']
                      ]); 
    img_links.push(arr);
    var current = $(this).closest('.item-gallery');
    $(this).closest('.wrap-gallery').find('.item-gallery').not(current).each(function () {
            if($(this).css('display') != 'none'){
                let thumb = $(this).children('img').attr('src');
                $(this).find('.overlay-item-gallery a').each(function(){
                    if($(this).data('href')) {
                        let title = $(this).data('title');
                        if(!title){
                            title = 'Мебель в стиле ЛОФТ';
                        }
                        var arr =  new Map([
                                ['img_full', $(this).data('href')],
                                ['img_thumb', thumb],
                                ['title', '<h4>'+title+'</h4>']
                              ]);  
                        img_links.push(arr);
                    }
                });
            }
    })
        /*Dymanic load*/
        let data =[];
        $.each(img_links, function (index, value){
            data.push(
                            {
                                "src": value.get('img_full'),
                                'thumb': value.get('img_thumb'),
                                'subHtml': value.get('title')
                            }   
                    );
        })
       
        $(this).lightGallery({
            dynamic: true,
            dynamicEl: data
        })
})

//Jquery LightGallery  for project success
$('.click-project-loft').on('click', function(e) {
    e.preventDefault();
    var img_links = [];
    $(this).closest('.block-projects').find('.gallery-case').each(function () {
            let title = $(this).find('.wrap-text-blo1').find('.title-project').html();
            let price = $(this).find('.price-project').html();
            
            $(this).find('.list-images-fullsize').find('a').each(function() {
                    
                    var arr = new Map([
                                ['img_full', $(this).data('href')],
                                ['img_thumb', $(this).data('href')],
                                ['title', '<div><h3>'+price+'</h3><h4> '+title+'</h4></div>']
                              ]);  
                    img_links.push(arr);
                })
                
                let data =[];
                $.each(img_links, function (index, value){
                data.push(
                                {
                                    "src": value.get('img_full'),
                                    'thumb': value.get('img_thumb'),
                                    'subHtml': value.get('title')
                                }   
                        );
                })
       
            $(this).lightGallery({
                dynamic: true,
                dynamicEl: data
            })
    });
});


})(jQuery);
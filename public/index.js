const swiper = new Swiper('.swiper-container', {
    slidesPerView: 3, 
    spaceBetween: 20, 
    loop: true, 
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 3000, 
    },
});
$(function() {
    
    //autocomplete for actor
    if($( ".js-autocomplete-actor" ).length > 0) {
        theMovieDB.autocomplete('.js-autocomplete-actor', 'person');
    }
    if($( ".js-autocomplete-movie" ).length > 0) {
        theMovieDB.autocomplete('.js-autocomplete-movie', 'movie');
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    function getNowDate() {
        var today = new Date();
        today = formatDate(today);
        return today;
    }
    function getDateFormated(date) {
        var today = new Date(date);
        today = formatDate(today);
        return today;
    }
    function getReduceDate(num = 50) {
        var dt = new Date();
        dt.setDate( dt.getDate() - num );
        return formatDate(dt);
    }

    //ACTORS
    $('#actorTopRated').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('with_people', theMovieDB.el.actor.id, 'sort_by=vote_count.desc');
    });
    $('#actorPopular').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('with_people', theMovieDB.el.actor.id, 'sort_by=popularity.desc');
    });
    $('#actorUpcoming').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('with_people', theMovieDB.el.actor.id, 'primary_release_date.gte='+getNowDate());
    });
    $('#actorPlayingNow').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('with_people', theMovieDB.el.actor.id, 'popularity.desc&release_date.gte='+getReduceDate(50)+'&release_date.lte='+getNowDate());
    });
    
    //GENRES
    $('#genreTopRated').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('with_genres', theMovieDB.el.genre.id, 'sort_by=vote_count.desc');
    });
    $('#genrePopular').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('with_genres', theMovieDB.el.genre.id, 'sort_by=popularity.desc');
    });
    $('#genreUpcoming').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('with_genres', theMovieDB.el.genre.id, 'primary_release_date.gte='+getNowDate());
    });
    $('#genrePlayingNow').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('with_genres', theMovieDB.el.genre.id, 'popularity.desc&release_date.gte='+getReduceDate(50)+'&release_date.lte='+getNowDate());
    });
    
    //Date range
    $('#rangeTopRated').on('click',function(e){
        e.preventDefault();
        var mindate = $('#minDate').val() ? getDateFormated($('#minDate').val()) : getDateFormated(new Date());
        var maxdate = $('#maxDate').val() ? getDateFormated($('#maxDate').val()) : getDateFormated(new Date());
        theMovieDB.filterMoviesBy('', '', 'sort_by=vote_count.desc&release_date.gte='+mindate+'&release_date.lte='+maxdate);
    });
    $('#rangePopular').on('click',function(e){
        e.preventDefault();
        var mindate = $('#minDate').val() ? getDateFormated($('#minDate').val()) : getDateFormated(new Date());
        var maxdate = $('#maxDate').val() ? getDateFormated($('#maxDate').val()) : getDateFormated(new Date());
        theMovieDB.filterMoviesBy('', '', 'sort_by=popularity.desc&release_date.gte='+mindate+'&release_date.lte='+maxdate);
    });
    $('#rangeUpcoming').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('', '','primary_release_date.gte='+getNowDate());
    });
    $('#rangePlayingNow').on('click',function(e){
        e.preventDefault();
        theMovieDB.filterMoviesBy('', '','popularity.desc&release_date.gte='+getReduceDate(50)+'&release_date.lte='+getNowDate());
    });

    //populate the genre selection
    if ($('.js-genreSelection').length > 0) {
        theMovieDB.getGenres();
        $('.js-genreSelection').on('change', function(e) {
            e.preventDefault();
            theMovieDB.el.genre.id = $(this).val();
            theMovieDB.el.genre.name = $(this).find('option:selected').text();
        });
    }

    //movie details page
    //blkMovieDetails
    if ($('.js-singleMovie').length > 0) {
        var mid = getParameterByName('mid');
        theMovieDB.getMovieDetails(mid, '.js-singleMovie');
    }
    //get querly strings
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    //min max datepicker
    if ($('.js-date-range').length > 0) {
        var from = $( "#minDate" )
        .datepicker({
            defaultDate: "-1w",
            changeMonth: true,
            numberOfMonths: 2
        })
        .on( "change", function() {
            to.datepicker( "option", "minDate", getDate( this ) );
        }),
        to = $( "#maxDate" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 2
        })
        .on( "change", function() {
            from.datepicker( "option", "maxDate", getDate( this ) );
        });
    }
    function getDate( element ) {
        var dateFormat = "mm/dd/yy";
        var date;
        try {
            date = $.datepicker.parseDate( dateFormat, element.value );
        } catch( error ) {
            date = null;
        }
        return date;
    }
    
    //on ready initialize Youtube play btns
    youTubeIframeAPI.play();
});

//IMPORTANT HAVE A onYouTubeIframeAPIReady outside document ready
function onYouTubeIframeAPIReady() {
    //initialize all yoyutube videos
    youTubeIframeAPI.init();
}

var youTubeIframeAPI = {
    el: {
        target: document.getElementsByClassName("js-ytPlayer"),
        player: [],
        playbtn: $('.js-youtubePlay')
    },
    init: function() {
        if(youTubeIframeAPI.el.target.length > 0){
            for(var i = 0; i < youTubeIframeAPI.el.target.length; i++) {
                var playerId = youTubeIframeAPI.el.target.item(i).id;
                youTubeIframeAPI.initializeVideo(playerId);
            }
        }
    },
    initializeVideo: function(vid) {
        youTubeIframeAPI.el.player[vid] = new YT.Player(vid, {
            height: '390',
            width: '100%',
            videoId: vid,
            //https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            playerVars: { 'autoplay': 0, 'controls': 0, 'rel':0,enablejsapi: 1}
        });
    },
    play: function(btn = youTubeIframeAPI.el.playbtn) {
        btn.on('click', function(e){
            e.preventDefault();
            var vId = $(this).parents('.js-ytPlayerWrapper').find('.js-ytPlayer').data('youtubeId');
            $(this).parents('.js-ytPlayerWrapper').find('.blk-video__thumbnail').fadeOut();
            youTubeIframeAPI.startVideo(vId);
        });
    },
    startVideo: function(vid) {
        if(youTubeIframeAPI.el.player[vid]){
            youTubeIframeAPI.el.player[vid].playVideo();
        }
    }
};

var theMovieDB = {
    el: {
        apiKey: "5453ab477fc9fbec85ed7444c83a8fe0",
        movie: {
            id: "",
            name: ""
        },
        actor: {
            id: "",
            name: ""
        },
        genre : {
            id: "",
            name: ""
        }
    },
    init: function(){
        console.log('inti');
    },
    filterMoviesBy: function(type, id,  filters) {
        //movie discovery
        //https://developers.themoviedb.org/3/discover/movie-discover
        $('#blkSearchResults').html('');
        var url =  "https://api.themoviedb.org/3/discover/movie?"+type+"="+id+"&page=1&include_video=false&include_adult=false&"+filters+"&language=en-US&api_key="+theMovieDB.el.apiKey;
        axios.get(url)
        .then(function (response) {
            for (var result in response.data.results) {
                if (response.data.results.hasOwnProperty(result)) {
                    $('#blkSearchResults').append(
                        '<ul class="list-unstyled">'+
                            '<li class="media">'+
                                '<img src="https://image.tmdb.org/t/p/w500/'+response.data.results[result].poster_path+'" style="max-width: 240px; width:100%; height: auto; ">'+
                                '<div class="media-body">'+
                                    '<h5 class="mt-0 mb-1">'+response.data.results[result].original_title+'</h5>'+
                                    '<p>'+response.data.results[result].overview+'</p>'+
                                    '<p>Average vote: '+response.data.results[result].vote_average+'</p>'+
                                    '<a class="btn" href="/movie.html?mid='+response.data.results[result].id+'">View</a>'+
                                '</div>'+
                            '</li>'+
                        '</ul>'
                    );
                }
            }
        });
    },
    autocomplete: function(selector, type) {
        //autocomplete for actor
        $(selector).autocomplete({
            source: function( request, response ) {
                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://api.themoviedb.org/3/search/"+type+"?api_key="+theMovieDB.el.apiKey+"&query="+$(selector).val(),
                    "method": "GET",
                    "headers": {},
                    "data": "{}"
                }
                $.ajax(settings).done(function (data) {
                    if(type == 'movie') {
                        response($.map(data.results, function (value, key) {
                            return {
                                id: value.id,
                                value: value.title
                            }
                        }));
                    } else {
                        response($.map(data.results, function (value, key) {
                            return {
                                id: value.id,
                                value: value.name
                            }
                        }));
                    }
                });
            },
            select: function( event, ui ) {
                if(type == 'movie') {
                    $('#movieId').val(ui.item.id);
                    theMovieDB.el.movie.id = ui.item.id;
                    theMovieDB.el.movie.name = ui.item.value;
                    theMovieDB.getMovieDetails(ui.item.id, '.js-movieInfo');
                } else {
                    $('#actorId').val(ui.item.id);
                    theMovieDB.el.actor.id = ui.item.id;
                    theMovieDB.el.actor.name = ui.item.value;
                }
            },
            minLength: 3,
        });
    },
    getGenres: function(){
        //get all genres
        var url = "https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key="+theMovieDB.el.apiKey;
        axios.get(url)
        .then(function (response) {
            for (var key in response.data.genres) {
                if (response.data.genres.hasOwnProperty(key)) {
                    $('.js-genreSelection').append('<option value="'+response.data.genres[key].id+'">'+response.data.genres[key].name+'</option>');
                }
            }
        });
    },
    getMovieTrailer: function(id=550){
        //get associated videos from movie
        var url = "https://api.themoviedb.org/3/movie/"+id+"/videos?language=en-US&api_key="+theMovieDB.el.apiKey;
        axios.get(url)
        .then(function (response) {
            $('.js-movieVideo').html(
                `<div class="blk-video js-ytPlayerWrapper">
                    <div class="blk-video__thumbnail" style="background-image: url('https://img.youtube.com/vi/`+response.data.results[0].key+`/hqdefault.jpg');">
                        <a href="#" class="blk-video__play js-youtubePlay"><i class="icon-play"></i></a>
                    </div>
                    <div id="`+response.data.results[0].key+`" class="js-ytPlayer" data-youtube-id="`+response.data.results[0].key+`"></div>
                <div>`
            );
            youTubeIframeAPI.initializeVideo(response.data.results[0].key);
            youTubeIframeAPI.play($('.js-youtubePlay'));
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    getMovieDetails: function(id=550, selector='.js-singleMovie'){
        //get a movie detail base on its id "550"
        $(selector).html('');
        var url = "https://api.themoviedb.org/3/movie/"+id+"?api_key="+theMovieDB.el.apiKey;
        axios.get(url)
        .then(function (response) {
            theMovieDB.getSimilarMovies(id);
            theMovieDB.getRecommendMovies(id);
            theMovieDB.getMovieCredits(id);
            $(selector).html('<div style="text-align: center; max-width: 675px; margin: 0 auto;">'+
            '<h2>'+response.data.original_title+'</h2>'+
            '<p style="max-width:450px; margin: 0 auto;">'+response.data.overview+'</p>'+
            '<p>Average vote: '+response.data.vote_average+'</p>'+
            '<div><img src="https://image.tmdb.org/t/p/w500/'+response.data.poster_path+'" style="max-width: 240px; width:100%; height: auto; margin-top: 20px;"></div>'+
            '<p>Trailer</p>'+
            '<div class="js-movieVideo">Video:</div>'+
            '</div>');
            
            theMovieDB.getMovieTrailer(id);
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    getSimilarMovies: function(id=550) {
        //get similar movies
        var url = "https://api.themoviedb.org/3/movie/"+id+"/similar?page=1&language=en-US&api_key="+theMovieDB.el.apiKey;
        axios.get(url)
        .then(function (response) {
            
            var html = "";
            for(var key= 0; key < 6; key++) {
                if (response.data.results.hasOwnProperty(key)) {
                    html += `
                    <div class="col-sm-4" style="margin-bottom: 10px;">
                    <img src="https://image.tmdb.org/t/p/w500/`+response.data.results[key].poster_path+`" style="max-width: 150px; width:100%; height: auto; ">
                    <p style="margin: 0;">`+response.data.results[key].title+`</p>
                    <a class="btn" href="/movie.html?mid=`+response.data.results[key].id+`">View</a>
                    </div>
                    `;
                }
            }
            $('.js-similarMovies').html(
                `
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3>Similar Movies:</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-8 offset-md-2">
                            <div class="row">
                                `+html+`
                            </div>
                        </div>
                    </div>
                </div>
                `
            );
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    getRecommendMovies: function(id=550) {
        var url = "https://api.themoviedb.org/3/movie/"+id+"/recommendations?page=1&language=en-US&api_key="+theMovieDB.el.apiKey;
        axios.get(url)
        .then(function (response) {
            var html = "";
            for(var key= 0; key < 6; key++) {
                if (response.data.results.hasOwnProperty(key)) {
                    html += `
                    <div class="col-sm-4" style="margin-bottom: 10px;">
                    <img src="https://image.tmdb.org/t/p/w500/`+response.data.results[key].poster_path+`" style="max-width: 150px; width:100%; height: auto; ">
                    <p style="margin: 0;">`+response.data.results[key].title+`</p>
                    <a class="btn" href="/movie.html?mid=`+response.data.results[key].id+`">View</a>
                    </div>
                    `;
                }
            }
            $('.js-recommendMovies').html(
                `
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3>Recommended Movies:</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-8 offset-md-2">
                            <div class="row">
                                `+html+`
                            </div>
                        </div>
                    </div>
                </div>
                `
            );
        });
    },
    getMovieCredits: function(id=550){
        var url = "https://api.themoviedb.org/3/movie/"+id+"/credits?api_key="+theMovieDB.el.apiKey;
        axios.get(url)
        .then(function (response) {
            var html = "";
            for(var key= 0; key < 6; key++) {
                if (response.data.cast.hasOwnProperty(key)) {
                    html += `
                    <div class="col-sm-2" style="margin-bottom: 10px;">
                    <img src="https://image.tmdb.org/t/p/w500/`+response.data.cast[key].profile_path+`" style="max-width: 150px; width:100%; height: auto; ">
                    <p style="margin: 0;"><strong>`+response.data.cast[key].character+`</strong></p>
                    <p style="margin: 0;">`+response.data.cast[key].name+`</p>
                    </div>
                    `;
                }
            }
            $('.js-creditMovie').html(
                `
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3>Top Billed Cast:</h3>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="row">
                                `+html+`
                            </div>
                        </div>
                    </div>
                </div>
                `
            );
        });
    }
}
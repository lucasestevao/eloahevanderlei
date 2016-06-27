/*
	Hyperspace by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	$(function() {

		var $window = $(window),
			$body = $('body'),
			$sidebar = $('#sidebar');

		// Hack: Enable IE flexbox workarounds.
		if (skel.vars.IEVersion < 12)
			$body.addClass('is-ie');

		// Disable animations/transitions until the page has loaded.
		if (skel.canUse('transition'))
			$body.addClass('is-loading');

		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-loading');
			}, 100);
		});

		// Forms.

		function validateForm() {
			var nameReg = /^[A-Za-z .'-çÇãáéíóúÁÉÍÓÚâêôÂÊÔàèìòùÀÈÌÒ]+$/;
			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

			var name = $.trim($('#name').val());
			var email = $.trim($('#email').val());
			var message = $.trim($('#message').val());

			var inputVal = new Array(name, email, message);

			var inputMessage = new Array('nome', 'email', 'mensagem');
			var valid = true;

			$('.error').remove();
			$('.return-message').html('');

			if (inputVal[0] === '') {
				$('#five .name').before('<span class="error"> Por favor, informe seu ' + inputMessage[0] + '</span>');
				valid = false;
			} else if (!nameReg.test(name)) {
				$('#five .name').before('<span class="error"> Use apenas letras</span>');
				valid = false;
			}

			if (inputVal[1] === '') {
				$('#five .email').before('<span class="error"> Por favor, informe seu ' + inputMessage[1] + '</span>');
				valid = false;
			} else if (!emailReg.test(email)) {
				$('#five .email').before('<span class="error"> Huuum... parece que seu email não é válido</span>');
				valid = false;
			}

			if (inputVal[2] === '') {
				$('#five .message').before('<span class="error"> Por favor, escreva uma ' + inputMessage[2] + '</span>');
				valid = false;
			}

			if (!valid) {
				$('.error').fadeIn();
			}

			return valid;
		}

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		$('form').on('submit', function(event) {
			event.preventDefault();
			event.stopPropagation();

			var dados = $(this).serialize();
			$('.return-message').html('').removeClass('fail');

			$.ajax({
				type: 'POST',
				url: 'send_form_email.php',
				data: dados,
				success: function(data) {
					if (data) {
						var response = JSON.parse(data);

						if (response.error) {
							$('.return-message').addClass('fail').html(response.message);
						} else {
							$('.return-message').html(response.message);

							$('#name').val('');
							$('#email').val('');
							$('#message').val('');
						}

						//console.log(data, response);
					}
				},
				error: function(data) {
					if (data && typeof data === 'object') {
						$('.return-message').addClass('fail').html(data.status + ' | Ops! Ocorreu um erro, tente novamente mais tarde.');
					}
				}
			});
		});

		$('form').on('click', '.submit', function(event) {
			event.preventDefault();
			event.stopPropagation();

			if (validateForm()) {
				$(this).parents('form').submit();
			}
		});

		// Prioritize 'important' elements on medium.
		skel.on('+medium -medium', function() {
			$.prioritize(
				'.important\\28 medium\\29',
				skel.breakpoint('medium').active
			);
		});

		// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
					if ($this.attr('href').charAt(0) != '#')
						return;

					// Deactivate all links.
					$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
					$this
						.addClass('active')
						.addClass('active-locked');

				})
				.each(function() {

					var $this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
					if ($section.length < 1)
						return;

					// Scrollex.
					$section.scrollex({
						mode: 'middle',
						top: '-10vh',
						bottom: '-10vh',
						initialize: function() {

							// Deactivate section.
							if (skel.canUse('transition'))
								$section.addClass('inactive');

						},
						enter: function() {

							// Activate section.
							$section.removeClass('inactive');

							// No locked links? Deactivate all links and activate this section's one.
							if ($sidebar_a.filter('.active-locked').length === 0) {

								$sidebar_a.removeClass('active');
								$this.addClass('active');

							}

							// Otherwise, if this section's link is the one that's locked, unlock it.
							else if ($this.hasClass('active-locked'))
								$this.removeClass('active-locked');

						}
					});

				});

		}

		// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
				if (skel.breakpoint('large').active && !skel.breakpoint('small').active && $sidebar.length > 0)
					return $sidebar.height();

				return 0;

			}
		});

		// Gallery.
		var $gallery = $('#thumbs');

		// Thumbs.
		$gallery.children('.thumb').each(function() {

			var $this = $(this),
				$image = $this.find('.image');

			// No image? Bail.
			if ($image.length === 0)
				return;

			// Set background.
			$image.css('background-image', 'url(' + $image.data('imgsrc') + ')');

			// Hack: IE<11 doesn't support pointer-events, which means clicks to our image never
			// land as they're blocked by the thumbnail's caption overlay gradient. This just forces
			// the click through to the image.
			if (skel.vars.IEVersion < 11)
				$this
				.css('cursor', 'pointer')
				.on('click', function() {
					$image.trigger('click');
				});

		});

		// Poptrox.
		$gallery.poptrox({
			baseZIndex: 20000,
			caption: function($a) {

				var s = '';

				$a.nextAll().each(function() {
					s += this.outerHTML;
				});

				return s;

			},
			fadeSpeed: 300,
			onPopupClose: function() {
				$body.removeClass('modal-active');
			},
			onPopupOpen: function() {
				$body.addClass('modal-active');
			},
			overlayOpacity: 0,
			popupCloserText: '',
			popupHeight: 150,
			popupLoaderText: '',
			popupSpeed: 300,
			popupWidth: 150,
			selector: '.thumb > a.image',
			usePopupCaption: true,
			usePopupCloser: true,
			usePopupDefaultStyling: false,
			usePopupForceClose: true,
			usePopupLoader: true,
			usePopupNav: true,
			windowMargin: 50
		});

		// Hack: Set margins to 0 when 'xsmall' activates.
		skel
			.on('-xsmall', function() {
				$gallery[0]._poptrox.windowMargin = 50;
			})
			.on('+xsmall', function() {
				$gallery[0]._poptrox.windowMargin = 0;
			});

		// Counter.
		function getTimeRemaining(endtime) {
			var t = Date.parse(endtime) - Date.parse(new Date());
			var seconds = Math.floor((t / 1000) % 60);
			var minutes = Math.floor((t / 1000 / 60) % 60);
			var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
			var days = Math.floor(t / (1000 * 60 * 60 * 24));

			return {
				'total': t,
				'days': days,
				'hours': hours,
				'minutes': minutes,
				'seconds': seconds
			};
		}

		function initializeClock(id, endtime) {
			var clock = document.getElementById(id);
			var daysSpan = clock.querySelector('.days');
			var hoursSpan = clock.querySelector('.hours');
			var minutesSpan = clock.querySelector('.minutes');
			var secondsSpan = clock.querySelector('.seconds');

			function updateClock() {
				var t = getTimeRemaining(endtime);

				daysSpan.innerHTML = t.days;
				hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
				minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
				secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

				if (t.total <= 0) {
					clearInterval(timeinterval);
				}
			}

			updateClock();
			var timeinterval = setInterval(updateClock, 1000);
		}

		var deadline = new Date(Date.parse(new Date('2016-07-30')));
		initializeClock('counter', deadline);

		// Player.
		function initializePlayer() {
			var player = $('#player'),
				playlist = $('#playlist'),
				tracks = playlist.find('li audio'),
				length = tracks.length,
				current = 0,
				audio = tracks[0];

			function playPause(offset) {
				if (tracks[current].paused) {
					if (offset !== 0) {
						current = (current + length + offset) % length;
						tracks[current].load();
					}
					tracks[current].play();
					player.find('.play').addClass('pause');
				} else {
					tracks[current].pause();
					if (offset !== 0) {
						current = (current + length + offset) % length;
						tracks[current].load();
						tracks[current].play();
					} else {
						player.find('.play').removeClass('pause');
					}
				}
			}

			function callPlayPause() {
				playPause(1);
			}

			for (var i = 0; i < length; i++) {
				tracks[i].addEventListener('ended', callPlayPause);
			}

			player.find('.play').click(function(e) {
				playPause(0);
			});
			player.find('.prev').click(function(e) {
				playPause(-1);
			});
			player.find('.next').click(function(e) {
				playPause(1);
			});
		}

		initializePlayer();

		// Sliders.
		var owl = $('#thumbs');

		owl.owlCarousel({
			items: 6,
			loop: true,
			margin: 26,
			dots: false,
			nav: true,
			navText: ['&#60;&#60;', '&#62;&#62;'],
			responsiveClass: true,
			responsive: {
				320: {
					items: 2,
					nav: false
				},
				360: {
					items: 3,
					nav: false
				},
				480: {
					items: 4,
					nav: true
				},
				980: {
					items: 5,
					nav: true
				},
				1280: {
					items: 6,
					nav: true
				}
			}
		});

		// Site Cover.
		var index = 0,
			bannerNav = $('#banner-nav').find('span');

		function changeBackground(newIndex) {
			$('#intro').removeClass('banner' + index);
			index = newIndex;
			$('#intro').addClass('banner' + newIndex);
			$(bannerNav).removeClass('active');
			$(bannerNav[index]).addClass('active');
		}

		$('#banner-nav').on('click', 'span', function(e) {
			changeBackground($(this).index());
		});

		setInterval(function() {
			changeBackground((index + 1) % bannerNav.length);
		}, 5000);

		// Instagram.
		// var feed = new Instafeed({
		// 	resolution: 'standard_resolution',
		// 	get: 'user',
		// 	userId: '307378172',
		// 	accessToken: '307378172.b67c612.60f0107b23a04e3a93ba97dd8e0905ea',
		// 	template: '<a href="{{link}}" target="_blank"><img src="{{image}}" alt="{{caption}}" title="{{caption}}" class="{{orientation}}" /></a>'
		// });

		// feed.run();


		// Debug Visual.
		var siteOpacity = 1.0,
			keys = [];

		window.executeHotkeyTest = function(callback, keyValues) {
			if (typeof callback !== 'function')
				throw new TypeError('Expected callback as first argument');
			if (typeof keyValues !== 'object' && (!Array.isArray || Array.isArray(keyValues)))
				throw new TypeError('Expected array as second argument');

			var allKeysValid = true;

			for (var i = 0; i < keyValues.length; ++i)
				allKeysValid = allKeysValid && keys[keyValues[i]];

			if (allKeysValid)
				callback();
		};

		window.addGlobalHotkey = function(callback, keyValues) {
			if (typeof keyValues === 'number')
				keyValues = [keyValues];

			var fnc = function(cb, val) {
				return function(e) {
					keys[e.keyCode] = true;
					executeHotkeyTest(cb, val);
				};
			}(callback, keyValues);
			window.addEventListener('keydown', fnc);
			return fnc;
		};

		window.addEventListener('keyup', function(e) {
			keys[e.keyCode] = false;
		});

		addGlobalHotkey(function() {
			//shift + d
			$('body').toggleClass('debug');
		}, [16, 68]);
		addGlobalHotkey(function() {
			//shift + up
			siteOpacity += 0.1;
			$('body').find('section').css({
				opacity: siteOpacity > 1 ? 1 : siteOpacity
			});
		}, [16, 38]);
		addGlobalHotkey(function() {
			//shift + down
			siteOpacity -= 0.1;
			$('body').find('section').css({
				opacity: siteOpacity < 0 ? 0 : siteOpacity
			});
		}, [16, 40]);

		// $('body').find('section').css({
		// 	opacity: 0.8
		// });

		$('.loja-img').lazyload();

	});

})(jQuery);

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

		// Fix: Placeholder polyfill.
		$('form').placeholder();

		// Hack: Activate non-input submits.
		$('form').on('click', '.submit', function(event) {

			// Stop propagation, default.
			event.stopPropagation();
			event.preventDefault();

			// Submit form.
			$(this).parents('form').submit();

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
						top: '-20vh',
						bottom: '-20vh',
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

		// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
					if (skel.canUse('transition'))
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
					$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var $this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
				$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
				if (x == $img.data('position'))
					$image.css('background-position', x);

				// Hide <img>.
				$img.hide();

			});

		// Features.
		if (skel.canUse('transition'))
			$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
					$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
					$(this).removeClass('inactive');

				}
			});
		// Gallery.
		var $gallery = $('#thumbs');

		// Thumbs.
		$gallery.children('.thumb').each(function() {

			var $this = $(this),
				$image = $this.find('.image'),
				$image_img = $image.children('img'),
				x;

			// No image? Bail.
			if ($image.length === 0)
				return;

			// Image.
			// This sets the background of the 'image' <span> to the image pointed to by its child
			// <img> (which is then hidden). Gives us way more flexibility.

			// Set background.
			$image.css('background-image', 'url(' + $image_img.attr('src') + ')');

			// Set background position.
			if (x == $image_img.data('position'))
				$image.css('background-position', x);

			// Hide original img.
			$image_img.hide();

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
			itemsDesktop: [1280, 5],
			itemsDesktopSmall: [980, 4],
			itemsTablet: [736, 3],
			itemsMobile: false,
			pagination: false,
			navigation: true,
			navigationText: ['<<', '>>'],
			autoHeight: true
		});

		// Custom Navigation Events
		owl.find('.next').click(function() {
			owl.trigger('owl.next');
		});
		owl.find('.prev').click(function() {
			owl.trigger('owl.prev');
		});

		var feed = new Instafeed({
			get: 'tagged',
			tagName: 'eloahevanderlei',
			clientId: '5265b3280ea54a759ab98f2634697821'
		});

		feed.run();
	});

})(jQuery);

(function ($) {
  "use strict";

  // Preloader js
  $(window).on("load", function () {
    $(".preloader").fadeOut(100);
  });

  // Sticky Menu
  $(window).scroll(function () {
    var height = $(".top-header").innerHeight();
    if ($("header").offset().top > 10) {
      $(".top-header").addClass("hide");
      $(".navigation").addClass("nav-bg");
      $(".navigation").css("margin-top", "-" + height + "px");
    } else {
      $(".top-header").removeClass("hide");
      $(".navigation").removeClass("nav-bg");
      $(".navigation").css("margin-top", "-" + 0 + "px");
    }
  });

  // Background-images
  $("[data-background]").each(function () {
    $(this).css({
      "background-image": "url(" + $(this).data("background") + ")",
    });
  });

  //  Count Up
  function counter() {
    var oTop;
    if ($(".count").length !== 0) {
      oTop = $(".count").offset().top - window.innerHeight;
    }
    if ($(window).scrollTop() > oTop) {
      $(".count").each(function () {
        var $this = $(this),
          countTo = $this.attr("data-count");
        $({
          countNum: $this.text(),
        }).animate(
          {
            countNum: countTo,
          },
          {
            duration: 1000,
            easing: "swing",
            step: function () {
              $this.text(Math.floor(this.countNum));
            },
            complete: function () {
              $this.text(this.countNum);
            },
          }
        );
      });
    }
  }
  $(window).on("scroll", function () {
    counter();
  });

  // Animation
  $(document).ready(function () {
    $(".has-animation").each(function (index) {
      $(this)
        .delay($(this).data("delay"))
        .queue(function () {
          $(this).addClass("animate-in");
        });
    });
  });


  if ($("#radar").length) {
    fetch("data/radar.csv")
      .then(function (resp) {
        return resp.text();
      })
      .then(function (csv) {
        let psv = d3.dsvFormat(";");
        var entries = psv.parse(csv, function (row) {
          return toEntry(row);
        });
        draw_radar(entries);
      });
  }

  let $radarLegend = $("#radar-legend");

  if ($radarLegend.length) {
    $radarLegend.on("click", "tr.radar-item", function () {
      let id = $(this).data("id");

      $(`tr.radar-item`).removeClass("active");
      $(this).toggleClass("active");

      $(`tr.radar-item-description`).addClass("hidden");
      $(`tr.radar-item-description[data-id=${id}]`, $radarLegend).toggleClass(
        "hidden"
      );
    });
  }
})(jQuery);

function draw_radar(my_entries) {
  techRadarViz({
    quadrants: quadrants,
    rings: rings,
    entries: my_entries,
    onClick: (i) => {
      let $radarLegend = $("#radar-legend");
      let el = $(`.radar-legend tbody tr.radar-item[data-id=${i + 1}]`).get(0);

      $(`tr.radar-item`).removeClass("active");
      $(`tr.radar-item-description`).addClass("hidden");
      $(`tr.radar-item[data-id=${i + 1}]`, $radarLegend).addClass("active");
      $(
        `tr.radar-item-description[data-id=${i + 1}]`,
        $radarLegend
      ).removeClass("hidden");

      let headerHeight = $(".fixed-top.header").height();
      let y =
        el.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    },
  });
}

function toEntry(row) {
  return {
    name: row.name,
    category: row.quadrant,
    quadrant: row.quadrant,
    quadrantIndex: quadrants.indexOf(row.quadrant),
    ring: rings.findIndex(function (item) {
      return item.name === row.ring;
    }),
    status: row.ring,
    ringName: row.ring,
    active: true,
  };
}

var rings = [
  {
    name: "Hold it",
    color: "#E74C3C",
  },
  {
    name: "Know it",
    color: "#3498DB",
  },
  {
    name: "Try it",
    color: "#F1C40F",
  },
  {
    name: "Use it",
    color: "#1ABC9C",
  },
];

var quadrants = [
  "DevOps",
  "Data",
  "Security",
  "Cloud",
];




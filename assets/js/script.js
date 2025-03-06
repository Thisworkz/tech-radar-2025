(function ($) {
  "use strict";

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
        // draw_radar(entries);
      });
  }

  if ($("#radar").length) {
    fetch("https://api.jsonbin.io/v3/b/67c9a7dae41b4d34e4a1d3d3", {
      headers: {
        "X-Access-Key":
          "$2a$10$KLQNcFWrJKXqQoPoeVPnPOKwBZ8raBULxl3h5P5iJr2EZMEoA1Xhu",
      },
    })
      .then(function (resp) {
        return resp.json();
      })
      .then(function (json) {
        var entries = json.record.map((element) => {
          return toEntry(element);
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
      $(`tr.radar-item-description[data-id=${i + 1}]`, $radarLegend).removeClass("hidden");

      let headerHeight = $(".fixed-top.header").height();
      let y = el.getBoundingClientRect().top + window.scrollY - headerHeight;

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




//Load map
var map = L.map('map',
{
   center: [41.4, 2.2],
   zoom: 13,
   maxZoom: 16,
   minZoom: 13,
   zoomControl: false,
  dragging: true
});



//cursor
L.DomUtil.addClass(map._container,'cell-cursor-enabled');


//Map bounds
var corner1 = L.latLng(41.35, 2.10),
   corner2 = L.latLng(41.47, 2.23),
   bounds = L.latLngBounds(corner1, corner2);
map.setMaxBounds(bounds);
map.on('drag', function()
{ //animation on or off
   map.panInsideBounds(bounds,
   {
      animate: false
   });
});

//Custom basemap
var basemap = L.tileLayer('dist/base/{z}/{x}/{y}.png',
{
   minZoom: 13,
   maxZoom: 16,
   tms: false,
   attribution: 'TilesXYZ'
}).addTo(map);


//Load and Style Points
//Abstract

var myRenderer = L.canvas({ padding: 0.5, tolerance:5 });

var CH2019 = L.geoJSON(abstract2019, {
    pointToLayer: function (feature, latlng) {
        return L.circle(latlng, styleCH(feature));
    }
});

var NCH2019 = L.geoJSON(abstract2019,{
    onEachFeature: onEachFeature,
    
    pointToLayer: function (feature, latlng) {
        return L.circle(latlng, styleNCH(feature));
    }
});

function styleCH(feature) {
	return {
        "renderer": myRenderer,
		"color": "black",
		"stroke": false,
		 "radius": getradius(feature.properties.CH2019,1,2,3,4,6,12),
    "fillOpacity": 1
	};}

function styleNCH(feature) {
	return {
        "renderer": myRenderer,
		"color": "#5ebfbf",
		"stroke": false,
		 "radius": getradius(feature.properties.NCH2019,3,5,8,11,15,22),
    "fillOpacity": 0.5
	};}


function getradius(x,a,b,c,d,e,f) {
	return      x < 0.5 ? 0.0 :
                x < a ? 15:
                x < b ? 25:
                x < c ? 35:
                x < d ? 45:
                x < e ? 55:
                x < f ? 65:
                x > f ? 75:        
		       0;
}

//Reality

var RCH2019 = L.geoJSON(CH2019reality, {
    onEachFeature: onEachDot,
    pointToLayer: function (feature, latlng) {
        return L.circle(latlng, styleRCH(feature)).bindTooltip(function (layer) {
    return layer.feature.properties.Name; 
 }, {className: 'TooltipCSS'}  
);
    }
});








var RNCH2019 = L.geoJSON(NCH2019reality, {
    pointToLayer: function (feature, latlng) {
        return L.circle(latlng, styleRNCH(feature));
    }
});

function styleRCH(feature) {
	return {
        "renderer": myRenderer,
		"color": "black",
        "weight": 1,
        "fillColor": "black",
		"stroke": true,
        "radius": getradiusreal(feature.properties.Number_sho,2,5,10,15,20,25),
    "fillOpacity": 1
	};}

function styleRNCH(feature) {
	return {
        "renderer": myRenderer,
		"color": "#5ebfbf",
//        "weight": 1,
//        "fillColor": "black",
		"stroke": false,
        "radius": 7,
    "fillOpacity": 1
	};}

function getradiusreal(x,a,b,c,d,e,f) {
	return      x = 0 ? 5 :
                x < a ? 5:
                x < b ? 10:
                x < c ? 15:
                x < d ? 20:
                x < e ? 25:
                x < f ? 30:
                x > f ? 35:        
		       0;
}


var heatline = L.geoJson(heatline, {
onEachFeature: onEachPolygon,   
style: heatLine
}
);

function heatLine(feature) {
    return {
        renderer: myRenderer,
        fillColor: 'yellow',
        weight: 10,
        opacity: 1,
        color: 'yellow',
        fillOpacity: 0,
        lineJoin: 'round',
            };
}


//Control Layer Visibility

CH2019.addTo(map)
NCH2019.addTo(map)

map.on('zoom', function(){
    var z = map.getZoom();

    if (z > 12 && z < 15) {
        return [CH2019.addTo(map),NCH2019.addTo(map), RCH2019.removeFrom(map),RNCH2019.removeFrom(map), heatline.removeFrom(map)] ;
    }

    return  [CH2019.removeFrom(map),NCH2019.removeFrom(map),heatline.addTo(map), RNCH2019.addTo(map),RCH2019.addTo(map)];
});



//retrieve information Asbtract

function onEachFeature(feature, layer)
{

layer.on('mouseover', function(e){
var NumChain = feature.properties.CH2019;
var NumNChain = feature.properties.NCH2019;
var outputChain = document.getElementById("absCH");
outputChain.innerHTML = NumChain +" chains";
var outputNChain = document.getElementById("absNCH");
outputNChain.innerHTML = NumNChain+" local";   
   });

layer.on('mouseout', function(e){
var outputChain = document.getElementById("absCH");
outputChain.innerHTML = "";
var outputNChain = document.getElementById("absNCH");
outputNChain.innerHTML = "";   
   });


}



//retrieve information Reality

var Realinfobox = document.getElementById("Realinfobox")


//Mouseover reality








function onEachDot(feature, layer) {
    
//    layer.on('mouseover', function(e){
//var CHname = feature.properties.Name;
//var outputName = document.getElementById("HotName");
//outputName.innerHTML = CHname;
// 
//   });
//    
//layer.on('mouseout', function(e){
//var outputName = document.getElementById("HotName");
//outputName.innerHTML = "";
// 
//   });
    
    
    
    layer.on({
        mouseover: highlightDot,
        mouseout: resetDotHighlight
    });
};

function highlightDot(e) {
    var layer = e.target;
    layer.setStyle(markerHighlight);
};

function resetDotHighlight(e) {
    var layer = e.target;
    layer.setStyle(markerDefault);
};

var markerDefault = {
    "fillColor": "black",
    "fillOpacity": 1,
};

var markerHighlight = {
    "fillColor": "yellow",
    "fillOpacity": 1,
};


function onEachPolygon(feature, layer) {
    

layer.on('mouseover', function(e){
var Name = feature.properties.Name;
var outputName = document.getElementById("HotName");
outputName.innerHTML = Name +" hotspot";
 
   });
    
layer.on('mouseout', function(e){
var outputName = document.getElementById("HotName");
outputName.innerHTML = "";
 
   });

    layer.on({
        mouseover: highlightPoly,
        mouseout: resetPolyHighlight
    });
};

function highlightPoly(e) {
    var layer = e.target;
    layer.setStyle(PolyHighlight);
};

function resetPolyHighlight(e) {
    var layer = e.target;
    layer.setStyle(PolyDefault);
};

var PolyDefault = {
    "fillColor": "transparent",
    "fillOpacity": 1,
};

var PolyHighlight = {
    "fillColor": "yellow",
    "fillOpacity": 1,
};



// zoom in function
        $('#in').click(function(){
          map.setZoom(map.getZoom() + 1)
        });


        // zoom out function
        $('#out').click(function(){
          map.setZoom(map.getZoom() - 1)
        });


root = @
if not root.app? then app = root.app = {} else app = root.app

app.eq_url = "http://data.usgin.org/arizona/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=azgs:earthquakedata&outputformat=json"
app.seismo_url = "http://data.usgin.org/arizona/azgs/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=azgs:seismostations&outputFormat=json"
app.esri_aerial = new L.TileLayer 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

app.classes = 9
app.scheme_id = "YlOrRd"
app.scheme = colorbrewer[app.scheme_id][app.classes]

app.map = new L.Map 'map',
    center: [33.867990, -111.985034]
    zoom: 7
app.map.addLayer app.esri_aerial

app.bbox_string = app.map.getBounds().toBBoxString()
app.bbox = app.bbox_string.split(',')
app.bbox_array = [[app.bbox[0],app.bbox[1]],[app.bbox[2],app.bbox[3]]]

app.map.svg = d3.select(app.map.getPanes().overlayPane).append 'svg'
app.map.g = app.map.svg.append('g').attr 'class', 'leaflet-zoom-hide'

app.graph_margin = {top:20, right:20, bottom:30, left:40}
app.graph_width = 475#960 - app.graph_margin.left - app.graph_margin.right
app.graph_height = 400#500 - app.graph_margin.top - app.graph_margin.bottom

app.graph_x = d3.scale.linear()
    .range([0, app.graph_width])
app.graph_y = d3.scale.linear()
    .range([app.graph_height, 0])
app.graph_x_axis = d3.svg.axis()
    .scale(app.graph_x)
    .orient('bottom')
app.graph_y_axis = d3.svg.axis()
    .scale(app.graph_y)
    .orient('left')

app.graph_svg = d3.select("#sidebar").append("svg")
    .attr("width", app.graph_width + app.graph_margin.left + app.graph_margin.right)
    .attr("height", app.graph_height + app.graph_margin.top + app.graph_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + app.graph_margin.left + "," + app.graph_margin.top + ")")

sidebarControl = L.Control.extend
    options:
        position: 'topleft'
    onAdd: (map) ->
        container = L.DomUtil.create('div','my-custom-control')
        container.title = 'Show me the money!'
        L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation)
                  .on(container, 'dblclick', L.DomEvent.stopPropagation)
                  .on(container, 'mousedown', L.DomEvent.stopPropagation)
        $(container).addClass 'glyphicon glyphicon-indent-right'
        return container
app.map.addControl new sidebarControl

magnitudeStyleControl = L.Control.extend
    options:
        position: 'topleft'
    onAdd: (map) ->
        container = L.DomUtil.create('div','magnitude-style-control')
        L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation)
                  .on(container, 'dblclick', L.DomEvent.stopPropagation)
                  .on(container, 'mousedown', L.DomEvent.stopPropagation)
        $(container).append '<div id="blow-up-magnitude"></div>'
        return container
app.map.addControl new magnitudeStyleControl

helpControl = L.Control.extend
    options:
        position: 'topleft'
    onAdd: (map) ->
        container = L.DomUtil.create('div', 'help-control')
        L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation)
                  .on(container, 'dblclick', L.DomEvent.stopPropagation)
                  .on(container, 'mousedown', L.DomEvent.stopPropagation)
        $(container).addClass 'glyphicon glyphicon-question-sign'
        return container
app.map.addControl new helpControl

magnitudeControl = L.Control.extend
    options:
        position: 'bottomleft'
    onAdd: (map) ->
        container = L.DomUtil.create('div', 'eq-magnitude-control')
        container.innerHTML = '<div class="custom-control-title">Earthquake Magnitude</div>'
        L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation)
                  .on(container, 'dblclick', L.DomEvent.stopPropagation)
                  .on(container, 'mousedown', L.DomEvent.stopPropagation)
        $(container).append '<div id="data-slider-eq-magnitude"></div>'
        return container
app.map.addControl new magnitudeControl

dateControl = L.Control.extend
    options:
        position: 'bottomleft'
    onAdd: (map) ->
        container = L.DomUtil.create('div', 'date-control')
        container.innerHTML = '<div class="custom-control-title">Date Filter</div>'
        L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation)
                  .on(container, 'dblclick', L.DomEvent.stopPropagation)
                  .on(container, 'mousedown', L.DomEvent.stopPropagation)
        $(container).append '<div id="data-slider-date"></div>'
        return container
app.map.addControl new dateControl

app.mag_svg = d3.select("#blow-up-magnitude").append('svg')
app.mag_g = app.mag_svg.append('g')

$.asm = {};
$.asm.panels = 1;

sidebar = (panels) ->
    $.asm.panels = panels
    if panels == 1
        $('#sidebar').animate
            right:"-100%"
    else if panels == 2
        $('#sidebar').animate
            right:"0%"
    $('#sidebar').height($(window).height());

$('.my-custom-control').click () ->
    if $.asm.panels == 1
        app.map.panTo(new L.LatLng(33.867990, -108.985034));
        return sidebar(2)
    else
        app.map.panTo(new L.LatLng(33.867990, -111.985034));
        return sidebar(1)
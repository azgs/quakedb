root = @
if not root.app? then app = root.app = {} else app = root.app

app.center = ol.proj.transform [-108.81034, 33.857990], 'EPSG:4326', 'EPSG:3857'

app.osm_layer = new ol.layer.Tile
    source: new ol.source.XYZ
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' + 
            'World_Imagery/MapServer/tile/{z}/{y}/{x}'

ol.expr.register 'resolution', ->
    app.map.getView().getView2D().getResolution()

app.view = new ol.View2D
    center: app.center
    zoom: 7

app.map = new ol.Map
    target: 'map'
    layers: [app.osm_layer]
    renderer: ol.RendererHint.CANVAS
    view: app.view

map = app.map

app.graph_margin = {top:20, right:20, bottom:30, left:40}
app.graph_width = 500
app.graph_height = 400

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

app.graph_svg = d3.select('#graph').append('svg')
    .attr('width', app.graph_width + app.graph_margin.left + app.graph_margin.right)
    .attr('height', app.graph_height + app.graph_margin.top + app.graph_margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + app.graph_margin.left + ',' + app.graph_margin.top + ')')

app.classes = 9
app.color_id = 'YlOrRd'
app.colors = colorbrewer[app.color_id][app.classes]

app.dataLayers = [
    new app.models.GeoJSONLayer
        id:'eqs'
        name:'Earthquakes'
        description:'Earthquakes in and around Arizona.'
        namespace:'azgs:earthquakedata'
        service_url:'http://data.usgin.org/arizona/ows'
        active: true
        layerOptions:
            style = new ol.style.Style
                symbolizers: [
                    new ol.style.Shape
                        size: ol.expr.parse 'drawMagSize()'
                        fill: new ol.style.Fill
                            color: ol.expr.parse 'drawFill()'
                            opacity: 0.7
                ]
]

app.mapControls = [
    new app.models.ControlModel
        href:'#sidebar-control'
        class_disp:'glyphicon glyphicon-indent-right'
        class_ol:'sidebar-control ol-unselectable'
]

app.graphs = [
    new app.models.GraphModel
        title: "this graph"
        type: 'linear'
]

app.dataLayerCollection = new app.models.LayerCollection app.dataLayers
app.mapControlCollection = new app.models.ControlCollection app.mapControls
app.graphCollection = new app.models.GraphCollection app.graphs

app.layers = new app.views.LayerView
    collection: app.dataLayerCollection
app.layers.render()

app.table = new app.views.TableView
app.table.render()
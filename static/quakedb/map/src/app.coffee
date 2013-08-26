root = @
if not root.app? then app = root.app = {} else app = root.app

xhr_url = "http://data.usgin.org/arizona/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=text/javascript&typeName=azgs:earthquakedata&outputformat=json"

app.classes = 9
app.scheme_id = "YlOrRd"
app.scheme = colorbrewer[app.scheme_id][app.classes]

console.log app.scheme

app.esri_aerial = new L.TileLayer 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

app.map = new L.Map 'map',
    center: [33.867990, -111.985034]
    zoom: 7

app.map.addLayer app.esri_aerial

app.bbox_string = app.map.getBounds().toBBoxString()
app.bbox = app.bbox_string.split(',')
app.bbox_array = [[app.bbox[0],app.bbox[1]],[app.bbox[2],app.bbox[3]]]

app.svg = d3.select(app.map.getPanes().overlayPane).append 'svg'
app.g = app.svg.append('g').attr 'class', 'leaflet-zoom-hide'

d3.json xhr_url, (error, collection) ->
    
    app.scaled_data = []
    collection.features.forEach (d) ->
        app.scaled_data.push(Math.abs(d.properties.calculated_magnitude))
    
    app.min = d3.min(app.scaled_data)
    app.max = d3.max(app.scaled_data)

    console.log app.min
    console.log app.max
    
    reset = () ->
        app.bottomLeft = project(app.bounds[0])
        app.topRight = project(app.bounds[1])
    
        app.svg.attr('width', app.topRight[0] - app.bottomLeft[0])
               .attr('height', app.bottomLeft[1] - app.topRight[1])
               .style('margin-left', app.bottomLeft[0] + 'px')
               .style('margin-top', app.topRight[1] + 'px')
    
        app.g.attr('transform', 'translate(' + -app.bottomLeft[0] + ',' + -app.topRight[1] + ')')

        app.feature.attr("cx",(d) -> return project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0] )
                   .attr("cy",(d) -> return project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1] )
#                   .attr("r",  (d) -> d.properties.calculated_magnitude*4)

        app.feature.attr 'd', app.path

    project = (x) ->
        app.point = app.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]))
        return [app.point.x, app.point.y]

    setInterval = () ->
        d3.select(@)
            .style('stroke-width', 3)
            .style('stroke', app.scheme[app.classes - 1])
            .transition()
            .ease("linear-in")
            .duration(1)
            .attr("r", 20)
            
    outInterval = () ->
        d3.select(@)
            .style('stroke-width', 1)
            .style('stroke', app.scheme[app.classes - 1])
            .transition()
            .ease('linear-out')
            .duration(1)
            .attr("r", 5)

    app.bounds = app.bbox_array
    app.path = d3.geo.path().projection project

    console.log d3.range(app.classes)
    
    app.scale = d3.scale.linear()
        .domain([app.min, app.max])
        .range(d3.range(app.classes))
    
    console.log app.scale

    app.feature = app.g.selectAll('circle')
        .data(collection.features)
        .enter().append('svg:circle')
        .attr('cx', (d) -> project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0] )
        .attr('cy', (d) -> project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1] )
        .attr('r', 5)
        .style('fill', (d) -> app.scheme[(app.scale(d.properties.calculated_magnitude) * 8).toFixed()])
        .style('stroke', app.scheme[app.classes - 1])
#        .attr('r', (d) -> d.properties.calculated_magnitude*4)
        .on('mouseover', setInterval)
        .on('mouseout', outInterval)
        
    app.map.on 'viewreset', reset
    reset()



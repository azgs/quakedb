root = @
if not root.app? then app = root.app = {} else app = root.app

app.drawmap = (collection) ->

    app.scaled_data = []
    app.date_data = []
    collection.features.forEach (d) ->
        console.log d
        app.scaled_data.push(Math.abs(d.properties.calculated_magnitude))
        
        date = d.properties.date
        date2 = date.split('T')
        date3 = date2[0].split('-')
        date4 = date3[0] + date3[1] + date3[2]
        app.date_data.push Math.abs(date4)


    app.min_mag = d3.min(app.scaled_data)
    app.max_mag = d3.max(app.scaled_data)
    
    app.min_date = d3.min(app.date_data)
    app.max_date = d3.max(app.date_data)
    
    
    mycallback = () -> console.log "DONE"
    
    app.reset = () ->
        app.bottomLeft = app.project(app.bounds[0])
        app.topRight = app.project(app.bounds[1])
    
        app.map.svg.attr('width', app.topRight[0] - app.bottomLeft[0])
               .attr('height', app.bottomLeft[1] - app.topRight[1])
               .style('margin-left', app.bottomLeft[0] + 'px')
               .style('margin-top', app.topRight[1] + 'px')
    
        app.map.g.attr('transform', 'translate(' + -app.bottomLeft[0] + ',' + -app.topRight[1] + ')')

        app.feature.attr("cx",(d) -> return app.project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0] )
                   .attr("cy",(d) -> return app.project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1] )
                   .attr("r", (d) -> d.properties.calculated_magnitude*4)

        app.feature.attr 'd', app.path

    app.project = (x) ->
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
    app.path = d3.geo.path().projection app.project

    console.log d3.range(app.classes)
    
    app.scale = d3.scale.linear()
        .domain([app.min_mag, app.max_mag])
        .range(d3.range(app.classes))

    app.feature = app.map.g.selectAll('circle')
        .data(collection.features)
        .enter().append('svg:circle')
        .attr('cx', (d) -> app.project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0] )
        .attr('cy', (d) -> app.project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1] )
        .style('fill', (d) -> app.scheme[(app.scale(d.properties.calculated_magnitude) * 8).toFixed()])
        .style('stroke', app.scheme[app.classes - 1])
        .style('opacity', 0.5)
        .attr('r', (d) -> d.properties.calculated_magnitude*4)
#        .on('mouseover', setInterval)
#        .on('mouseout', outInterval)
        
    app.map.on 'viewreset', app.reset
    app.reset()
    
    get_mag = (d) -> return d.properties.calculated_magnitude
    
    app.mag_filter = (min,max) ->
        minv = min
        maxv = max
        d3.selectAll("circle").classed("selected", (d) -> return maxv >= get_mag(d) && get_mag(d) >= minv)
        selected = d3.selectAll(".selected")
        d3.selectAll("circle").style("display", "none")
        selected.style("display", "block")
    
    get_date = (d) ->
        date = d.properties.date
        date2 = date.split('T')
        date3 = date2[0].split('-')
        date4 = date3[0] + date3[1] + date3[2]
        return Math.abs(date4)

    app.date_filter = (min, max) ->
        minv = min
        maxv = max
        d3.selectAll("circle").classed("selected", (d) -> return maxv >= get_date(d) && get_date(d) >= minv)
        selected = d3.selectAll(".selected")
        d3.selectAll("circle").style("display", "none")
        selected.style("display", "block")

app.drawseismo = (collection) ->
    app.project = (x) ->
        app.point = app.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]))
        return [app.point.x, app.point.y]
    
    app.path = d3.geo.path().projection app.project
    
    app.feature = app.g.selectAll('path')
        .data(collection.features)
        .enter().append('path')
#        .attr('cx', (d) -> app.project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[0] )
#        .attr('cy', (d) -> app.project([d.geometry.coordinates[0], d.geometry.coordinates[1]])[1] )
        .attr('d', app.path)
#        .style('fill', 'black')
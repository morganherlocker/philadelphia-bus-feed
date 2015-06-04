var request = require('request')
var turf = require('turf')
var fs = require('fs')

var buses = {}
var currentFile = ''

setInterval(function(){
  request('http://www3.septa.org/hackathon/TransitViewAll/', function(err, res, body){
    try{
      var data = JSON.parse(body)
      data = data[Object.keys(data)[0]]
      var busesData = []

      data.forEach(function(route){
        route[Object.keys(route)[0]].forEach(function(bus){
          busesData.push(bus)
        })
      })
      data = busesData

      var time = new Date()
      var file = __dirname + '/out/'+time.getFullYear()+'-'+time.getMonth()+'-'+time.getDay()+'-'+time.getHours()+'.geojson'

      if(file !== currentFile) {
        buses = {}
        currentFile = file
      }

      data.forEach(function(bus){
        if(!buses[bus.VehicleID]) {
          buses[bus.VehicleID] = turf.linestring([], {id: bus.VehicleID, times: []})
        }
        var lastCoord = buses[bus.VehicleID].geometry.coordinates[buses[bus.VehicleID].geometry.coordinates.length - 1]
        if(buses[bus.VehicleID].geometry.coordinates.length === 0 || !(lastCoord[0] === bus.lng && lastCoord[1] === bus.lat)){
          buses[bus.VehicleID].geometry.coordinates.push([
              bus.lng,
              bus.lat
            ])
          buses[bus.VehicleID].properties.times.push(time.getMinutes()+':'+time.getSeconds())
        }
      })

      fs.writeFileSync(file, JSON.stringify(getTraces(buses)))
    } catch(e){
      console.log(e)
    }
  })
}, 10000)

function getTraces (buses) {
  return turf.featurecollection(Object.keys(buses).map(function(route){
    return buses[route]
  }).filter(function(route){
    if(route.geometry.coordinates.length > 1) return true
  }))
}
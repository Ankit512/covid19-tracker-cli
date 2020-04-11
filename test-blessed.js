

const   blessed         =   require('blessed'),
        contrib         =   require('blessed-contrib'),
        Stream          =   require('stream'),
        GFXUtil         =   require('./lib/cli/gfx/server-util');
        

const showGraph = (callback) => {

  blessed.Screen.global = null
  blessed.Program.global = null
  const 
      readableStream  =   new Stream.Transform()
      screen          =   GFXUtil.createScreen({stream: readableStream}),
      grid            =   new contrib.grid({rows: 10, cols: 10, screen: screen})
  
  let result = []

  var donut = grid.set(0, 0, 2, 2, contrib.donut, 
    {
    label: 'Percent Donut',
    radius: 10,
    arcWidth: 4,
    yPadding: 4,
    data: [{label: 'Storage', percent: 87}]
  })


  var map = grid.set(0, 2, 4, 4, contrib.map,
    {
      label: 'World Map'
    })

    map.addMarker({"lon" : "-79.0000", "lat" : "37.5000", color: 'yellow', char: 'vgdfggdfX' })

  /*readableStream._write = (chunk, encoding, next) => {
    res.send(chunk.toString())
  }*/

  readableStream._transform = function (chunk,encoding,done) 
{
    result.push(chunk.toString())
    done()
}

  readableStream._final = () => {
    callback(result.join(''))
  }

  screen.render()

  setTimeout(() => {
    readableStream.end()
  }, 100)
}

module.exports = showGraph


    
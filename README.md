# philadelphia-bus-feed

Aggregate data from the [Philadelphia realtime bus feed](http://www3.septa.org/hackathon/TransitViewAll/) ([docs](http://www3.septa.org/hackathon/)).

##install

```
git clone git@github.com:morganherlocker/philadelphia-bus-feed.git
cd philadelphia-bus-feed
npm install
```

##run

```
node index.js
```

This will create hourly geojson files with aggregated route data in `./out`.

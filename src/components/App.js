import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as contentful from "contentful";
import { attach } from "contentful-wizard";

const contentfulClient = contentful.createClient({
  space: "gwr2bryocotv",
  accessToken:
    "1b084e7585e640e51efed3f4173a6a06070ed0cc96a220fbb3b794edb721339b",
  host: "preview.contentful.com"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: null
    };
    this.cleanups = [];
  }

  componentWillMount() {
    document.title = "STAGING: Cities - Lyft";
    contentfulClient
      .getEntries({ content_type: "city", order: "fields.name" })
      .then(data => {
        // var cities = data.items.map(city => city.fields.title).sort()
        var obj = {};
        for (let i = 0; i < data.items.length; i++) {
          obj[data.items[i].fields.name] = data.items[i];
        }
        this.setState({ cities: obj }, () => {
          console.log(this.state);

          Object.keys(obj).map(city => {
            const cityObject = obj[city];

            console.log(cityObject);

            const cleanup = attach({
              node: this[`city_${cityObject.sys.id}`],
              contentType: cityObject.sys.contentType.sys.id,
              entry: cityObject.sys.id,
              entryTitle: cityObject.fields.name,
              spaceId: cityObject.sys.space.sys.id
            });

            this.cleanups.push(cleanup);
          });
        });
      });
  }

  componentWillUnmount() {
    this.cleanups.forEach(cleanup => cleanup());
  }

  render() {
    if (!this.state.cities) {
      return <div>loading</div>;
    }
    console.log(this.state.cities);
    let results = Object.keys(this.state.cities).map((city, i) => {
      const id = this.state.cities[city].sys.id;
      return (
        <li
          ref={node => (this[`city_${id}`] = node)}
          key={this.state.cities[city].sys.id}
        >
          <Link
            to={`/cities/${this.state.cities[city].fields.slug}`}
            className="list-city"
          >
            {city}
          </Link>
        </li>
      );
    });
    return (
      <div className="available-lyft-cities">
        <h1>Available Lyft Cities</h1>
        <ul>{results}</ul>
      </div>
    );
  }
}

export default App;

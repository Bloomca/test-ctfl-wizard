import React, { Component } from "react";
import Switch from "react-switch";
import Mustache from 'mustache';

import * as contentful from 'contentful';
const contentfulClient = contentful.createClient({
  space: 'gwr2bryocotv',
  accessToken: '1b084e7585e640e51efed3f4173a6a06070ed0cc96a220fbb3b794edb721339b',
  host: 'preview.contentful.com'
})

class City extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: false,
      selectedCity: null,
      waysToRide: null,
      citySnippets: null,
      clicked: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.selectLyft = this.selectLyft.bind(this);
  }

  handleChange(checked) {
    if (this.state.language === 'en-US') {
      contentfulClient.getEntries({content_type: 'city', 'fields.slug': window.location.href.split('/')[4], include: 10, locale: 'es'}).then(data => {
      this.setState({selectedCity: data.items[0], waysToRide: data.items[0].fields.waysToRide, language: data.items[0].sys.locale, citySnippets: data.items[0].fields.citySnippets.fields})
  })
    }
    if (this.state.language === 'es') {
      contentfulClient.getEntries({content_type: 'city', 'fields.slug': window.location.href.split('/')[4], include: 10, locale: 'en-US'}).then(data => {
      this.setState({selectedCity: data.items[0], waysToRide: data.items[0].fields.waysToRide, language: data.items[0].sys.locale, citySnippets: data.items[0].fields.citySnippets.fields})
  })
    }
    this.setState({ checked });
}

selectLyft(event) {
  this.setState({clicked: event.currentTarget.id})
  let lyft = event.currentTarget.innerText
  let newlySelected = this.state.waysToRide.find(function(ele) {
    return ele.fields.title === lyft
  })
  this.setState({selectedLyftType: newlySelected})
}

  componentWillMount() {
    contentfulClient.getEntries({content_type: 'city', 'fields.slug': window.location.href.split('/')[4], include: 10}).then(data => {
      console.log(data);
    this.setState({selectedCity: data.items[0], waysToRide: data.items[0].fields.waysToRide, selectedLyftType: data.items[0].fields.waysToRide[0], language: data.items[0].sys.locale, citySnippets: data.items[0].fields.citySnippets.fields}, ()=> {
      document.title = "STAGING: " + this.state.selectedCity.fields.name + " - Lyft"
      console.log(this.state);
    })
})
  }

  render() {
    if (!this.state.waysToRide) {
      return (<div>loading</div>)
    }

    let modules = this.state.selectedCity.fields.miniModules.map((module, i) => {
      if (this.state.selectedCity.fields.miniModules[i].fields.text.includes('airport')) {
        var hlwAiport = Mustache.render(this.state.selectedCity.fields.miniModules[i].fields.text, this.state.citySnippets)
        return (
          <div className='mini-module' key={this.state.selectedCity.fields.miniModules[i].sys.id}>
            <img src={"https:" + this.state.selectedCity.fields.miniModules[i].fields.image.fields.file.url} className='hlw-works-img' alt={this.state.selectedCity.fields.miniModules[i].fields.image.fields.title} />
            <div>{hlwAiport}</div>
          </div>
        )
      }
      return (
        <div className='mini-module' key={this.state.selectedCity.fields.miniModules[i].sys.id}>
          <img src={"https:" + this.state.selectedCity.fields.miniModules[i].fields.image.fields.file.url} className='hlw-works-img' alt={this.state.selectedCity.fields.miniModules[i].fields.image.fields.title} />
          <div>{this.state.selectedCity.fields.miniModules[i].fields.text}</div>
        </div>
      )
    })

    let waysToRide = this.state.waysToRide.map((way, i) => {
      return (
          <li key={i} className={way.sys.id === this.state.clicked ? 'way-to-ride pink' : 'way-to-ride' } id={way.sys.id} onClick={this.selectLyft}>{way.fields.title}</li>
      );
    });

    let articles = this.state.selectedCity.fields.featuredContent.map((article, i) => {
      return (
        <div className='featured-article' key={this.state.selectedCity.fields.featuredContent[i].sys.id}>
          <img src={"https:" + this.state.selectedCity.fields.featuredContent[i].fields.image.fields.file.url} className='featured-article-img' alt={this.state.selectedCity.fields.featuredContent[i].fields.image.fields.title} />
          <h3 className='featured-article-header'>{this.state.selectedCity.fields.featuredContent[i].fields.title}</h3>
          <div className='featured-article-description'>{this.state.selectedCity.fields.featuredContent[i].fields.description}</div>
        </div>
      )
    })

    let lyftTypeRows = Object.keys(this.state.selectedLyftType.fields).map((row, i) => {
      if (!isNaN(this.state.selectedLyftType.fields[row])) {
        return (
          <tr>
            <td align='left' className='table-label'>{row.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })}</td>
            <td align='right'>${this.state.selectedLyftType.fields[row].toFixed(2)}</td>
          </tr>
        )
      }
    })

    return (
      <div className='selected-city'>
        <p></p>
        <div><a href={"https://app.contentful.com/spaces/gwr2bryocotv/entries/" + this.state.selectedCity.sys.id}>EDIT THIS ENTRY</a></div>
        <p></p>
        <Switch onChange={this.handleChange} checked={this.state.checked} id="normal-switch" />
        <div className='language-label'>Language: {this.state.checked ? 'Spanish' : 'English'}</div>
        <div className='selected-city-header'>
          <div className="centered">
            <h2 className='header-text'>{this.state.selectedCity.fields.name} Area</h2>
            <p></p>
            <div className='header-button'>{this.state.selectedCity.fields.headerButtonText}</div>
        </div>
        <img src={"https:" + this.state.selectedCity.fields.headerImage.fields.file.url} className='city-header-image' alt={this.state.selectedCity.fields.headerImage.fields.title} />
        </div>
        <div className='hlw-works-and-modules'>
          <h2 className='hlw-works-header'>{this.state.selectedCity.fields.howLyftWorks.fields.name.split(" -")[0]}</h2>
          <p></p>
          <p className='hlw-paragraph'>{Mustache.render(this.state.selectedCity.fields.howLyftWorks.fields.cityParagraph, this.state.citySnippets)}</p>
          <p></p>
          <div className='mini-modules'>
            {modules}
          </div>
        </div>
        <iframe className='map' width="100%;" height="450" frameBorder="0" src={"https:www.google.com/maps/embed/v1/view?zoom=10&center=" + this.state.selectedCity.fields.mapLocation.lat + "," + this.state.selectedCity.fields.mapLocation.lon + "&key=AIzaSyD1tikw8SKZocGZ4HnjrKef8Ign_yM1iWI"} allowFullScreen title='location'></iframe>
        <div className='estimate-trip'>
          <div className='estimate-trip-text'>
            <h2 className='estimate-trip-heading'>{this.state.selectedCity.fields.estimateTrip.fields.heading}</h2>
            <p className='estimate-trip-description'>{this.state.selectedCity.fields.estimateTrip.fields.description}</p>
          </div>
          <div className='estimate-trip-ugc'>
            <img src='https://cl.ly/1U2K1U1g2P0Q/Screen%20Shot%202018-02-25%20at%206.54.22%20AM.png' className='estimate-trip-ugc-img' alt='estimate-trip' />
          </div>
        </div>
        <h2 className='featured-content-header'>Featured Content</h2>
        <div className='featured-content'>
          {articles}
        </div>
        <div className='ways-to-ride'>
          <h2 className='ways-to-ride-title'>Ways to Ride</h2>
          <img src={"https:" + this.state.selectedLyftType.fields.image.fields.file.url} className='ways-to-ride-img' alt='way to ride' />
          <div className='lyft-type-description'>{this.state.selectedLyftType.fields.description}</div>
          <ul className='ways-to-ride-list'>
            {waysToRide}
          </ul>
          <table className='table-container'>
            <tbody className='table'>
              {lyftTypeRows}
            </tbody>
          </table>
        </div>

        <div className='drive-with-lyft-in-city'>
          <h2 className='drive-with-lyft-header'>{Mustache.render(this.state.selectedCity.fields.driveWithLyftModule.fields.title, this.state.citySnippets)}</h2>
          <div className='drive-with-lyft-description'>
            {Mustache.render(this.state.selectedCity.fields.driveWithLyftModule.fields.description, this.state.citySnippets)}
            <ul className='drive-with-lyft-articles'>
            </ul>
          </div>
        </div>
        <div className='cta-module'>
          <img src={"https:" + this.state.selectedCity.fields.ctaModuleApply.fields.image.fields.file.url} className='cta-img' alt='cta'/>
          <div className='cta-text-and-button'>
            <h3 className='cta-text'>{this.state.selectedCity.fields.ctaModuleApply.fields.headline}</h3>
            <div className='cta-button'>{this.state.selectedCity.fields.ctaModuleApply.fields.actionButtonText}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default City;

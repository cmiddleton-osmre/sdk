/* global beforeEach, describe, it */

import {assert, expect} from 'chai';
import chai from 'chai';
import chaiXml from 'chai-xml';
import raf from 'raf';
import ol from 'openlayers';
import SLDService from '../../js/services/SLDService';

raf.polyfill();
chai.use(chaiXml);

describe('SLDService', function() {

  var fillColor, strokeColor;

  beforeEach(function() {
    fillColor = {
      hex: 'FF0000',
      rgb: {
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
      }
    };
    strokeColor = {
      hex: 'FF0000',
      rgb: {
        r: 255,
        g: 0,
        b: 0,
        a: 0.5
      }
    };
  });

  it('creates the correct fill', function() {
    var fill = SLDService.createFill({
      fillColor: fillColor
    });
    for (var i, ii = fill.cssParameter.length; i < ii; ++i) {
      var key = fill.cssParameter[i].name;
      if (key === 'fill') {
        assert.equal(fill.cssParameter[i].content[0], '#FF0000');
      }
      if (key === 'fill-opacity') {
        assert.equal(fill.cssParameter[i].content[0], '0.5');
      }
    }
  });

  it('creates the correct stroke', function() {
    var stroke = SLDService.createStroke({
      strokeColor: strokeColor,
      strokeWidth: 2
    });
    for (var i, ii = stroke.cssParameter.length; i < ii; ++i) {
      var key = stroke.cssParameter[i].name;
      if (key === 'stroke') {
        assert.equal(stroke.cssParameter[i].content[0], '#FF0000');
      }
      if (key === 'stroke-width') {
        assert.equal(stroke.cssParameter[i].content[0], '2');
      }
      if (key === 'stroke-opacity') {
        assert.equal(stroke.cssParameter[i].content[0], '0.5');
      }
    }
  });

  it('creates a polygon symbolizer', function() {
    var symbol = SLDService.createPolygonSymbolizer({
      strokeColor: strokeColor,
      strokeWidth: 2,
      fillColor: fillColor
    });
    assert.equal(symbol.name.localPart, 'PolygonSymbolizer');
    assert.equal(symbol.value.fill !== undefined, true);
    assert.equal(symbol.value.stroke !== undefined, true);
  });

  it('creates a line symbolizer', function() {
    var symbol = SLDService.createLineSymbolizer({
      strokeColor: strokeColor,
      strokeWidth: 2
    });
    assert.equal(symbol.name.localPart, 'LineSymbolizer');
    assert.equal(symbol.value.fill === undefined, true);
    assert.equal(symbol.value.stroke !== undefined, true);
  });

  it('creates a point symbolizer', function() {
    var symbol = SLDService.createPointSymbolizer({
      strokeColor: strokeColor,
      fillColor: fillColor,
      symbolType: 'circle',
      symbolSize: '4'
    });
    assert.equal(symbol.name.localPart, 'PointSymbolizer');
    assert.equal(symbol.value.graphic.externalGraphicOrMark[0].wellKnownName, 'circle');
    assert.equal(symbol.value.graphic.externalGraphicOrMark[0].fill !== undefined, true);
    assert.equal(symbol.value.graphic.externalGraphicOrMark[0].stroke !== undefined, true);
    assert.equal(symbol.value.graphic.size.content[0], '4');
  });

  it('roundtrips PointSymbolizer ExternalGraphic', function() {
    var sld = '<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><sld:NamedLayer><sld:Name>Default Styler</sld:Name><sld:UserStyle><sld:Name>Default Styler</sld:Name><sld:FeatureTypeStyle><sld:Name>name</sld:Name><sld:Rule><sld:Name>rule1</sld:Name><sld:PointSymbolizer><sld:Graphic><sld:ExternalGraphic><sld:OnlineResource xlink:href="https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/128/Map-Marker-Marker-Outside-Azure.png"/><sld:Format>image/png</sld:Format></sld:ExternalGraphic><sld:Size>20</sld:Size><sld:Rotation>90.0</sld:Rotation></sld:Graphic></sld:PointSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>';
    var info = SLDService.parse(sld);
    var sld2 = SLDService.createSLD(new ol.layer.Layer({id: 'Default Styler', styleInfo: info}), 'Point', info.rules);
    expect(sld).xml.to.equal(sld2);
  });

  it('roundtrips SLD Cook Book: Simple Point', function() {
    var sld = '<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><sld:NamedLayer><sld:Name>Simple Point</sld:Name><sld:UserStyle><sld:Title>SLD Cook Book: Simple Point</sld:Title><sld:FeatureTypeStyle><sld:Rule><sld:PointSymbolizer><sld:Graphic><sld:Mark><sld:WellKnownName>circle</sld:WellKnownName><sld:Fill><sld:CssParameter name="fill">#FF0000</sld:CssParameter></sld:Fill></sld:Mark><sld:Size>6</sld:Size></sld:Graphic></sld:PointSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>';
    var info = SLDService.parse(sld);
    var sld2 = SLDService.createSLD(new ol.layer.Layer({id: 'Simple Point', styleInfo: info}), 'Point', info.rules);
    expect(sld).xml.to.equal(sld2);
  });

  it('roundtrips GeoServer SLD Cook Book: Simple point with stroke', function() {
    var sld = '<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><sld:NamedLayer><sld:Name>Simple point with stroke</sld:Name><sld:UserStyle><sld:Title>GeoServer SLD Cook Book: Simple point with stroke</sld:Title><sld:FeatureTypeStyle><sld:Rule><sld:PointSymbolizer><sld:Graphic><sld:Mark><sld:WellKnownName>circle</sld:WellKnownName><sld:Fill><sld:CssParameter name="fill">#FF0000</sld:CssParameter></sld:Fill><sld:Stroke><sld:CssParameter name="stroke">#000000</sld:CssParameter><sld:CssParameter name="stroke-width">2</sld:CssParameter></sld:Stroke></sld:Mark><sld:Size>6</sld:Size></sld:Graphic></sld:PointSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>';
    var info = SLDService.parse(sld);
    var sld2 = SLDService.createSLD(new ol.layer.Layer({id: 'Simple point with stroke', styleInfo: info}), 'Point', info.rules);
    expect(sld).xml.to.equal(sld2);
  });

  it('roundtrips GeoServer SLD Cook Book: Rotated square', function() {
    var sld = '<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><sld:NamedLayer><sld:Name>Rotated square</sld:Name><sld:UserStyle><sld:Title>GeoServer SLD Cook Book: Rotated square</sld:Title><sld:FeatureTypeStyle><sld:Rule><sld:PointSymbolizer><sld:Graphic><sld:Mark><sld:WellKnownName>square</sld:WellKnownName><sld:Fill><sld:CssParameter name="fill">#009900</sld:CssParameter></sld:Fill></sld:Mark><sld:Size>12</sld:Size><sld:Rotation>45</sld:Rotation></sld:Graphic></sld:PointSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>';
    var info = SLDService.parse(sld);
    var sld2 = SLDService.createSLD(new ol.layer.Layer({id: 'Rotated square', styleInfo: info}), 'Point', info.rules);
    expect(sld).xml.to.equal(sld2);
  });

  it('roundtrips GeoServer SLD Cook Book: Transparent triangle', function() {
    var sld = '<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><sld:NamedLayer><sld:Name>Transparent triangle</sld:Name><sld:UserStyle><sld:Title>GeoServer SLD Cook Book: Transparent triangle</sld:Title><sld:FeatureTypeStyle><sld:Rule><sld:PointSymbolizer><sld:Graphic><sld:Mark><sld:WellKnownName>triangle</sld:WellKnownName><sld:Fill><sld:CssParameter name="fill">#009900</sld:CssParameter><sld:CssParameter name="fill-opacity">0.2</sld:CssParameter></sld:Fill><sld:Stroke><sld:CssParameter name="stroke">#000000</sld:CssParameter><sld:CssParameter name="stroke-width">2</sld:CssParameter></sld:Stroke></sld:Mark><sld:Size>12</sld:Size></sld:Graphic></sld:PointSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>';
    var info = SLDService.parse(sld);
    var sld2 = SLDService.createSLD(new ol.layer.Layer({id: 'Transparent triangle', styleInfo: info}), 'Point', info.rules);
    expect(sld).xml.to.equal(sld2);
  });

  it('roundtrips GeoServer SLD Cook Book: Point as graphic', function() {
    var sld = '<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><sld:NamedLayer><sld:Name>Point as graphic</sld:Name><sld:UserStyle><sld:Title>GeoServer SLD Cook Book: Point as graphic</sld:Title><sld:FeatureTypeStyle><sld:Rule><sld:PointSymbolizer><sld:Graphic><sld:ExternalGraphic><sld:OnlineResource xlink:href="smileyface.png"/><sld:Format>image/png</sld:Format></sld:ExternalGraphic><sld:Size>32</sld:Size></sld:Graphic></sld:PointSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>';
    var info = SLDService.parse(sld);
    var sld2 = SLDService.createSLD(new ol.layer.Layer({id: 'Point as graphic', styleInfo: info}), 'Point', info.rules);
    expect(sld).xml.to.equal(sld2);
  });

  it('roundtrips vendor options in TextSymbolizer', function() {
    var sld = '<sld:StyledLayerDescriptor xmlns:sld="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><sld:NamedLayer><sld:Name>ne:populated_places</sld:Name><sld:UserStyle><sld:Name>populated_places</sld:Name><sld:FeatureTypeStyle><sld:Name>name</sld:Name><sld:Rule><sld:Name>Untitled 1</sld:Name><sld:TextSymbolizer><sld:Label><ogc:PropertyName>NAME</ogc:PropertyName></sld:Label><sld:VendorOption name="conflictResolution">true</sld:VendorOption><sld:VendorOption name="group">yes</sld:VendorOption></sld:TextSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>';
    var info = SLDService.parse(sld);
    var sld2 = SLDService.createSLD(new ol.layer.Layer({id: 'ne:populated_places', styleInfo: info}), undefined, info.rules);
    expect(sld).xml.to.equal(sld2);
  });

  it('deals with optional values in createTextSymbolizer', function() {
    var error = false;
    try {
      SLDService.createTextSymbolizer({labelAttribute: 'NAME'});
    } catch (e) {
      error = true;
    }
    assert.equal(error, false);
  });

});

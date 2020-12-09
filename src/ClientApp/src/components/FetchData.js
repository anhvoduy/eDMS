import React, { Component } from 'react';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { forecasts: [], loading: true, data: null, empList: null};
  }

  componentDidMount() {
    //this.populateWeatherData();
    //this.populateSharePointData();
    this.populateEmployeeData();
  }

  static renderForecastsTable(forecasts) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.date}>
              <td>{forecast.date}</td>
              <td>{forecast.temperatureC}</td>
              <td>{forecast.temperatureF}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderForecastsTable(this.state.forecasts);
    let { data } = this.state;
    return (
      <div>
        <h1 id="tabelLabel" >Weather forecast</h1>
        <p>This component demonstrates fetching data from the server.</p>
        <div>{contents}</div>
        <p>connnected to sharepoint site : {(data && data.web_title) ? data.web_title : ''} - {(data && data.list_count) ? data.list_count : 0}</p>
      </div>
    );
  }

  static xml2json(xml, tab) {
    var X = {
        toObj: function (xml) {
            var o = {};
            if (xml.nodeType == 1) { // element node ..
                if (xml.attributes.length) // element with attributes  ..
                    for (var i = 0; i < xml.attributes.length; i++)
                        o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
                if (xml.firstChild) { // element has child nodes ..
                    var textChild = 0,
                        cdataChild = 0,
                        hasElementChild = false;
                    for (var n = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1) hasElementChild = true;
                        else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType == 4) cdataChild++; // cdata section node
                    }
                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml);
                            for (var n = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3) // text node
                                    o["#text"] = X.escape(n.nodeValue);
                                else if (n.nodeType == 4) // cdata node
                                    o["#cdata"] = X.escape(n.nodeValue);
                                else if (o[n.nodeName]) { // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array)
                                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else
                                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                } else // first occurence of element..
                                    o[n.nodeName] = X.toObj(n);
                            }
                        } else { // mixed content
                            if (!xml.attributes.length)
                                o = X.escape(X.innerXml(xml));
                            else
                                o["#text"] = X.escape(X.innerXml(xml));
                        }
                    } else if (textChild) { // pure text
                        if (!xml.attributes.length)
                            o = X.escape(X.innerXml(xml));
                        else
                            o["#text"] = X.escape(X.innerXml(xml));
                    } else if (cdataChild) { // cdata
                        if (cdataChild > 1)
                            o = X.escape(X.innerXml(xml));
                        else
                            for (var n = xml.firstChild; n; n = n.nextSibling)
                                o["#cdata"] = X.escape(n.nodeValue);
                    }
                }
                if (!xml.attributes.length && !xml.firstChild) o = null;
            } else if (xml.nodeType == 9) { // document.node
                o = X.toObj(xml.documentElement);
            } else
                alert("unhandled node type: " + xml.nodeType);
            return o;
        },
        toJson: function (o, name, ind) {
            var json = name ? ("\"" + name + "\"") : "";
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++)
                    o[i] = X.toJson(o[i], "", ind + "\t");
                json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
            } else if (o == null)
                json += (name && ":") + "null";
            else if (typeof (o) == "object") {
                var arr = [];
                for (var m in o)
                    arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
            } else if (typeof (o) == "string")
                json += (name && ":") + "\"" + o.toString() + "\"";
            else
                json += (name && ":") + o.toString();
            return json;
        },
        innerXml: function (node) {
            var s = ""
            if ("innerHTML" in node)
                s = node.innerHTML;
            else {
                var asXml = function (n) {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < n.attributes.length; i++)
                            s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                        if (n.firstChild) {
                            s += ">";
                            for (var c = n.firstChild; c; c = c.nextSibling)
                                s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        } else
                            s += "/>";
                    } else if (n.nodeType == 3)
                        s += n.nodeValue;
                    else if (n.nodeType == 4)
                        s += "<![CDATA[" + n.nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling)
                    s += asXml(c);
            }
            return s;
        },
        escape: function (txt) {
            return txt.replace(/[\\]/g, "\\\\")
                .replace(/[\"]/g, '\\"')
                .replace(/[\n]/g, '\\n')
                .replace(/[\r]/g, '\\r');
        },
        removeWhite: function (e) {
            e.normalize();
            for (var n = e.firstChild; n;) {
                if (n.nodeType == 3) { // text node
                    if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    } else
                        n = n.nextSibling;
                } else if (n.nodeType == 1) { // element node
                    X.removeWhite(n);
                    n = n.nextSibling;
                } else // any other node
                    n = n.nextSibling;
            }
            return e;
        }
    };
    if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
    var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
    return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
  }
  
  async populateWeatherData() {
    const response = await fetch('weatherforecast');
    const data = await response.json();
    //console.log(data);
    this.setState({ forecasts: data, loading: false });
  }

  async populateSharePointData() {
    const response = await fetch('api/document/sharepoint');
    const res = await response.json();
    console.log(res.data.result);
    this.setState({ data: res.data.result });
  }

    fetchSharePoint(url, headers) {
        return new Promise(function (resolve, reject) {
            fetch(url, headers).then(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });      
    }

  async populateEmployeeData() {
        const url = 'https://development365.sharepoint.com/sites/develop/_api/web?$select=Title';
        const headers = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiJodHRwczovL2RldmVsb3BtZW50MzY1LnNoYXJlcG9pbnQuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZDQ5NjFmMWItZDgwZC00NzViLWEzYzMtN2QwOWIyNGJkNWQyLyIsImlhdCI6MTYwNzUxMDI3MywibmJmIjoxNjA3NTEwMjczLCJleHAiOjE2MDc1MTQxNzMsImFjciI6IjEiLCJhY3JzIjpbInVybjp1c2VyOnJlZ2lzdGVyc2VjdXJpdHlpbmZvIiwidXJuOm1pY3Jvc29mdDpyZXExIiwidXJuOm1pY3Jvc29mdDpyZXEyIiwidXJuOm1pY3Jvc29mdDpyZXEzIiwiYzEiLCJjMiIsImMzIiwiYzQiLCJjNSIsImM2Il0sImFpbyI6IkUyUmdZRENSMjFZMmIwTFRpNnZzR2xVWEhPbzJsRGxWTXE2dGZCd2NlY0ZZdjlFdE9SWUEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6ImRlbW8tc2hhcmVwb2ludCIsImFwcGlkIjoiNzVkODkxMjAtZDM4OS00NzMwLTkzYzYtOGU2MTQ0ZWRlYjM3IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJUcnVtcCIsImdpdmVuX25hbWUiOiJEb25hbGQiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxMTMuMTYxLjQzLjgwIiwibmFtZSI6IkRvbmFsZCBUcnVtcCIsIm9pZCI6IjkwOTY2YmQ4LTk5YjktNGFiNi1hOWE3LTRlMGQ3NTg1ZDQxYSIsInB1aWQiOiIxMDAzN0ZGRUE0OThCQzAzIiwicmgiOiIwLkFBQUFHeC1XMUEzWVcwZWp3MzBKc2t2VjBpQ1IySFdKMHpCSGs4YU9ZVVR0Nnpkd0FBby4iLCJzY3AiOiJBbGxTaXRlcy5NYW5hZ2UgVXNlci5SZWFkIiwic2lkIjoiMjlkODkxYmMtMjg3OC00NzU4LTgzZWUtYzk2MWJiZGY4YTcxIiwic3ViIjoiU0ZDNHNhTDVvTTZ2Yk5GbHNYNjBmS2VKTlJxRFlnYklnVHdCX1FrS0kzMCIsInRpZCI6ImQ0OTYxZjFiLWQ4MGQtNDc1Yi1hM2MzLTdkMDliMjRiZDVkMiIsInVuaXF1ZV9uYW1lIjoidHJ1bXBAZGV2ZWxvcG1lbnQzNjUub25taWNyb3NvZnQuY29tIiwidXBuIjoidHJ1bXBAZGV2ZWxvcG1lbnQzNjUub25taWNyb3NvZnQuY29tIiwidXRpIjoicE5WVTJBeDduMGlwNjRSOS05TTFBUSIsInZlciI6IjEuMCIsIndpZHMiOlsiY2YxYzM4ZTUtMzYyMS00MDA0LWE3Y2ItODc5NjI0ZGNlZDdjIiwiZjI4YTFmNTAtZjZlNy00NTcxLTgxOGItNmExMmYyYWY2YjZjIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il19.fgHhHev82VYxGExWs9f0FM4xNDi5onzYYIW2ML_wlak01TCkBozvcVCS7Wx4HhIcYnagH3FOaEEXOPuF5L6tOhP2WaDQ1WTzMVErMtsR07ErEaa5SG5Nc5-GgoEMaAtDttBtPL5JTLrGMfrHhyh0iUWKxU4E6L49XRSRwu3cTW5fsdSTZtfWZ36QNv-g-T-HzvrQjpvwtWBc6RfoFhNI1QSJQcCWIlNXhJTuQCjp0h1I3mNUbnq0rMrYlIhOGLy41whd2N6KpKYxIQVLe0jrT3E_zomCTsgCQA1SHTb6Xi3zkqOck89JchfQBX4pUeJaP6vv_oP2dJ7KUyLGxSVn4A',
                'Accept': 'Application/json;odata=verbose'
            },
        };

        const res = await this.fetchSharePoint(url, headers);
        console.log(res.body);

        //var result1 = await convert.xml2json(response);
        //console.log(result1);
        //const res = await response.json();
        //console.log(res.data.result);
        //this.setState({ empList: res.data.result });
  }
}

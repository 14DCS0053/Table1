import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    data: [],
    loading: true,
    formData: {
      user_name: "",
      email: "",
      phone: "",
      address: { street: "", suite: "", city: "" },
      company: { name: "" }

    },
    form_open: false,
    current_step: 1,
    formMode: "add data"
  }
  componentDidMount() {
    axios.get("https://jsonplaceholder.typicode.com/users").then(Data => {
      this.setState({
        data: Data.data,
        loading: false
      })
    })
  }
  openForm = (formMode, value, data = {}) => {
    if (!value) {
      return this.setState({
        formData: {
          user_name: "",
          email: "",
          phone: "",
          address: { street: "", suite: "", city: "" },
          company: { name: "" }

        },
        formMode: "add data",
        form_open: false
      })
    }
    if (formMode == "add data") {
      this.setState({ formMode, form_open: value })
    }
    else {
      const { id, username: user_name, email, phone, address: { street, suite, city }, company: { name } } = data;
      var newFormData = {
        id,
        user_name,
        email,
        phone,
        address: { street, suite, city },
        company: { name }

      }
      this.setState({ formMode, form_open: value, formData: newFormData })
    }

  }
  submit = () => {
    var { formMode } = this.state;
    var { id, username: user_name, email, phone, address: { street, suite, city }, company: { name } } = this.state.formData;
    var newFormData = {
      user_name:
        email,
      phone,
      address: { street, suite, city },
      company: { name }

    }
    this.setState({ loading: true }, () => {
      var newFormData = {
        user_name:
          email,
        phone,
        address: { street, suite, city },
        company: { name }

      }
      if (formMode == "add data") {
        axios.post("https://jsonplaceholder.typicode.com/users", newFormData).then(async Data => {
          var newData = await axios.get("https://jsonplaceholder.typicode.com/users");
          this.setState({
            loading: false,
            data: newData.data,
            form_open: false,
            formData: {
              user_name: "",
              email: "",
              phone: "",
              address: { street: "", suite: "", city: "" },
              company: { name: "" }

            }
          })
        })
      }
      else {
        axios.put("https://jsonplaceholder.typicode.com/users/" + id, newFormData).then(async (Data) => {
          var newData = await axios.get("https://jsonplaceholder.typicode.com/users");
          this.setState({
            loading: false,
            data: newData.data,
            form_open: false,
            formData: {
              user_name: "",
              email: "",
              phone: "",
              address: { street: "", suite: "", city: "" },
              company: { name: "" }

            }
          })
        })
      }
    })
  }
  getAddress = address => {
    const { street, suite, city } = address;
    return `${street},${suite},${city}`;
  }
  deleteRecord = id => {
    this.setState({
      loading: true
    }, () => {
      axios.delete("https://jsonplaceholder.typicode.com/users/" + parseInt(id), { id: 2 }).then(async (Data) => {
        var newData = await axios.get("https://jsonplaceholder.typicode.com/users");
        this.setState({
          data: newData.data,
          loading: false
        })
      })
    })
  }
  change = (key, data, obj = false, parentKey) => {
    if (obj) {
      this.setState({ formData: { ...this.state.formData, [parentKey]: { ...this.state[parentKey], [key]: data } } });
    }
    else {
      this.setState({ formData: { ...this.state.formData, [key]: data } })
    }
  }
  changeStep = current_step => {
    this.setState({
      current_step
    })
  }
  render() {
    const { data, loading, form_open, current_step, formData: { user_name, email, phone, address: { street, suite, city }, company: { name } } } = this.state;
    return (
      <div>
        {loading && <div className="loader-box"><div className="App-logo"></div></div>}
        {loading == false && <button onClick={this.openForm.bind(this, "add data", true)} className="add-data">Add Data</button>}
        {form_open && <div className="form-box">
          <form>
            <div onClick={this.openForm.bind(this, "add data", false)} className="close-btn"><i class="fa fa-times" aria-hidden="true"></i></div>
            {current_step == 1 && <Fragment>
              <label>User name</label>
              <input type="text" placeholder="User name" value={user_name} onChange={(e) => this.change("user_name", e.target.value)} />
              <label>Email</label>
              <input type="email" placeholder="Email address" value={email} onChange={(e) => this.change("email", e.target.value)} />
              <label>Phone no.</label>
              <input type="text" placeholder="Phone no." value={phone} onChange={(e) => this.change("phone", e.target.value)} />
              <label>Address</label>
              <input type="text" placeholder="Street" value={street} onChange={(e) => this.change("street", e.target.value, true, "address")} />
              <input type="text" placeholder="Suite" value={suite} onChange={(e) => this.change("suite", e.target.value, true, "address")} />
              <input type="text" placeholder="City" value={city} onChange={(e) => this.change("city", e.target.value, true, "address")} />
            </Fragment>}

            {current_step == 2 && <Fragment>
              <label>Company</label>
              <input type="text" placeholder="Company" value={name} onChange={(e) => this.change("name", e.target.value, true, "company")} />
            </Fragment>}
            {current_step == 1 && <button onClick={this.changeStep.bind(this, 2)}>Next</button>}
            {current_step == 2 && <div className="button-area">
              <button onClick={this.changeStep.bind(this, 1)}>Previous</button>
              <button onClick={this.submit} type="button">Submit</button>
            </div>}

          </form>
        </div>}
        {data.length > 0 && <table CELLSPACING={0}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => <tr>
              <td>{d.name}</td>
              <td>{d.email}</td>
              <td>{this.getAddress(d.address)}</td>
              <td>{d.phone.split(" ")[0]}</td>
              <td><button onClick={this.openForm.bind(this, "edit", true, d)}><i class="fa fa-pencil" aria-hidden="true"></i></button>
                <button onClick={this.deleteRecord.bind(this, d.id)}><i class="fa fa-trash" aria-hidden="true"></i></button></td>
            </tr>)}
          </tbody>
        </table>}
      </div>
    );
  }
}

export default App;

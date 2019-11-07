import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';

import { withFirebase } from '../Firebase';
import {withAuthorization} from '../Session';


class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
      data: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });

    this.props.firebase.data().on('value', snapshot => {
      const dataObject = snapshot.val();

      const dataList = Object.keys(dataObject).map(key => ({
        ...dataObject[key],
        dataid: key,
      }));

      this.setState({
        data: dataList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, data, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>

        {loading && <div>Loading ...</div>}

        <UserList users={users} />
        <DataList data={data} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <div>
    {users.map(user => (
      <div key={user.uid}>
        <ul>
        <li>
          <strong>ID:</strong> {user.uid}
        </li>
        <li>
          <strong>E-Mail:</strong> {user.email}
        </li>
        <li>
          <strong>Username:</strong> {user.username}
          </li>
          </ul>
      </div>
    ))}
  </div>
);

const DataList = ({ data }) => (
  <div>
    {data.map(data => (
    <div key={data.dataid}>
      <ul>
        <li>
          <strong>ID:</strong> {data.dataid}
        </li>
        <li>
          <strong>Name:</strong> {data.name}
        </li>
        <li>
          <strong>Data:</strong> {data.data}
          </li>
          </ul>
      </div>
    ))}
  </div>
);


const AllList = withFirebase(AdminPage);
export { AllList };
  

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AdminPage);
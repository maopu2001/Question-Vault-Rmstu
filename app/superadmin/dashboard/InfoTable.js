import React from 'react';

export default function InfoTable({ userList }) {
  console.log(userList);
  return (
    <table className="border-collapse min-w-[350px] w-5/6 text-center" border={2}>
      <tbody>
        <tr className="*:border *:border-primary-500 *:px-1">
          <th>Name</th>
          <th>Username / Email</th>
          <th>Degree</th>
          <th>Faculty / Department</th>
          <th>Session</th>
        </tr>
        {userList.map((user, i) => (
          <React.Fragment key={i}>
            <tr className="*:border *:border-primary-500 *:px-1">
              <td rowSpan={2}>{user?.name}</td>
              <td>{user?.username}</td>
              <td rowSpan={2}>{user?.degree}</td>
              <td>{user?.faculty}</td>
              <td rowSpan={2}>{user?.session}</td>
            </tr>
            <tr className="*:border *:border-primary-500 *:px-1">
              <td>{user?.email}</td>
              <td>{user?.department}</td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

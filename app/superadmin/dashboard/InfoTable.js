import React from 'react';

export default function InfoTable({ userList, error }) {
  console.log(userList);
  return (
    <div className="min-w-[400px] w-5/6 overflow-x-auto">
      {error && <p className="text-center font-semibold mb-2">{error}</p>}
      {!error && (
        <table className="border-collapse text-center mx-auto" border={2}>
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
      )}
    </div>
  );
}

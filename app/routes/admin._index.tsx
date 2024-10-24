import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { prisma } from "~/db.server"

export const loader = async () => {
  const allUsers = await prisma.user.findMany()
  const evaluations = await prisma.evaluation.findMany({
    include: {
      fromUser: {
        include: {
          role: true,
        },
      },
    },
  })

  const allResults: Record<number, number> = {}
  evaluations.forEach((evaluation) => {
    if (!allResults[evaluation.to]) {
      allResults[evaluation.to] = 0
    }
    allResults[evaluation.to] += evaluation.point * evaluation.fromUser.role.rate
  })

  return json({ ok: true, evaluations: evaluations, allUsers: allUsers, allResults: allResults })
}

export default function Index() {
  const { allResults, allUsers } = useLoaderData<typeof loader>()

  return (
    <>
      <div className="p-5">
        <button className="btn">
          <Link to="/">戻る</Link>
        </button>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>user</th>
              <th>totalpoint</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(allResults).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{allUsers.find((user) => user.id === Number(key))?.name}</td>
                <td>{allResults[Number(key)]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

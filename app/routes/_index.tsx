import { ActionFunction, json, type MetaFunction } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { prisma } from "~/db.server"

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const users = await prisma.user.findMany()
  const evaluations = await prisma.evaluation.findMany({
    include: {
      fromUser: true,
      toUser: true,
    },
  })

  return json({ ok: false, users: users, evaluations: evaluations })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  if (request.method === "DELETE") {
    console.log("DELETE")
    const targetEvaluationId = formData.get("targetEvaluationId")
    console.log(targetEvaluationId)
    await prisma.evaluation.delete({
      where: {
        id: Number(targetEvaluationId),
      },
    })
    return json({ ok: true })
  }

  const from = formData.get("from")
  const to = formData.get("to")
  const point = formData.get("point")

  await prisma.evaluation.create({
    data: {
      from: Number(from),
      to: Number(to),
      point: Number(point),
    },
  })

  return json({ ok: true })
}

export default function Index() {
  const { users, evaluations } = useLoaderData<typeof loader>()

  return (
    <>
      <div className="p-5">
        <Form replace method="post">
          <div className="flex items-center justify-center">
            <label className="form-control w-full max-w-xs">
              <select name="from" className="select select-bordered">
                <option disabled selected>
                  評価元
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control w-full max-w-xs ml-5">
              <select name="to" className="select select-bordered">
                <option disabled selected>
                  評価先
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>

            <input name="point" type="number" placeholder="POINT" className="input input-bordered w-full max-w-xs ml-5" />
          </div>
          <div className="flex items-center justify-center mt-10">
            <button className="btn" type="submit">
              評価する
            </button>
          </div>
        </Form>
        <div className="mt-10">
          <h2>評価一覧</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>from</th>
                  <th>to</th>
                  <th>point</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id}>
                    <th>{evaluation.id}</th>
                    <td>{evaluation.fromUser.name}</td>
                    <td>{evaluation.toUser.name}</td>
                    <td>{evaluation.point}</td>
                    <td>
                      <Form method="DELETE" replace>
                        <button type="submit" className="btn btn-square p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <input type="hidden" name="targetEvaluationId" value={evaluation.id} />
                      </Form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex items-center justify-center">
            <Link to="/admin" className="btn">
              結果一覧へ
            </Link>
          </div>
        </div>
        <div className="mt-10">
          <h1>社員一覧</h1>
          {users.map((user) => (
            <div key={user.id}>
              <Link to={`/admin/${user.id}`}>
                <p></p>
                <h2 className="link link-primary">{user.name}</h2>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

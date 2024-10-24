import { json, LoaderFunctionArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { prisma } from "~/db.server"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  console.log(id)

  const targetUser = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  })

  const evaluations = await prisma.evaluation.findMany({
    where: {
      to: Number(id),
    },
    include: {
      fromUser: {
        include: {
          role: true,
        },
      },
    },
  })

  const totalPoint = evaluations.reduce((acc, evaluation) => {
    return acc + evaluation.point * evaluation.fromUser.role.rate
  }, 0)

  return json({ ok: true, evaluations: evaluations, targetUser: targetUser, totalPoint: totalPoint })
}

export default function Index() {
  const { evaluations, targetUser, totalPoint } = useLoaderData<typeof loader>()
  console.log(evaluations)

  return (
    <>
      <div className="p-5">
        <button className="btn mb-10">
          <Link to="/">戻る</Link>
        </button>
        <h1 className="mb-10">{targetUser?.name}の評価</h1>
        <h2 className="mb-10">評価合計 {totalPoint}点</h2>
        {evaluations.map((evaluation) => (
          <div key={evaluation.id} className="flex items-center justify-between">
            <div>
              {evaluation.fromUser.name}から{evaluation.point}点（×{evaluation.fromUser.role.rate} = {evaluation.point * evaluation.fromUser.role.rate}点）
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

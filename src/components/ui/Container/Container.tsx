import { ReactNode } from "react"

type ContainerProps = {
    children: ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
    return <div className="max-w-96 mx-auto py-6 px-4">{children}</div>
}
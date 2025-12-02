import React from "react";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}
const page = async ({ params }: Props) => {
  const { projectId } = await params;
  return <div>project ID: {projectId}</div>;
};

export default page;

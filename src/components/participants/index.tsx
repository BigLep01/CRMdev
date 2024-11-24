import type { FC } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";

import { CustomAvatar } from "../custom-avatar";

type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

type Props = {
  userOne: User;
  userTwo: User;
};

export const Participants: FC<Props> = ({ userOne, userTwo }) => {
  return (
    <Space
      size={4}
      style={{
        textTransform: "uppercase",
      }}
    >
      <Tooltip title={userOne.name}>
        <CustomAvatar
          size="small"
          src={userOne.avatarUrl}
          name={userOne.name}
        />
      </Tooltip>
      <PlusCircleOutlined className="xs tertiary" />
      <Tooltip title={userTwo.name}>
        <CustomAvatar
          size="small"
          src={userTwo.avatarUrl}
          name={userTwo.name}
        />
      </Tooltip>
    </Space>
  );
};

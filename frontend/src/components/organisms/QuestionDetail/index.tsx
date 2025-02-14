import React, { FunctionComponent } from "react";

import { DetailBody } from "@components/organisms";
import { QuestionTitle } from "@components/molecules";
import { QuestionDetailType } from "@src/types";
import * as Styled from "./styled";

interface Props {
  question: QuestionDetailType;
}

const QuestionDetail: FunctionComponent<Props> = ({ question }) => {
  const {
    title,
    realtimeShare,
    author,
    desc,
    tags,
    viewCount,
    createdAt,
    thumbupCount,
  } = question;

  return (
    <Styled.QuestionDetailContainer>
      <Styled.QuestionHeader>
        <QuestionTitle
          text={title}
          type={realtimeShare ? "online" : "offline"}
        />
        <Styled.QuestionHeaderInfo>
          Asked {createdAt.slice(0, 10)} View {viewCount}
        </Styled.QuestionHeaderInfo>
      </Styled.QuestionHeader>
      <DetailBody detail={{ desc, tags, thumbupCount, author }} />
    </Styled.QuestionDetailContainer>
  );
};

export default QuestionDetail;

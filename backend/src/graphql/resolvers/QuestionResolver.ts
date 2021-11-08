import {
  Arg,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { PostAnswer } from "../../entities/PostAnswer";
import { PostQuestion } from "../../entities/PostQuestion";
import { Tag } from "../../entities/Tag";
import { User } from "../../entities/User";
import AddQuestionInput from "../inputTypes/AddQuestionInput";
import SearchQuestionInput from "../inputTypes/SearchQuestionInput";
import PostService from "../services/PostService";
import TagService from "../services/TagService";
import UserService from "../services/UserService";

@Resolver(PostQuestion)
export default class QuestionResolver {
  @Query(() => PostQuestion, {
    description: "questionID를 통해 하나의 질문글 검색",
    nullable: true,
  })
  async findOneQuestionById(
    @Arg("id", () => Int, { description: "질문글 ID" }) id: number
  ) {
    const question = await PostService.findOneQuestionById(id);

    return question;
  }

  @FieldResolver(() => User, { description: "작성자 User Object" })
  async author(@Root() question: PostQuestion): Promise<User> {
    const author = await UserService.findOneUserById(question.userId);

    return author;
  }

  @FieldResolver(() => [PostAnswer], {
    description: "해당 질문글에 달린 답변글",
    nullable: "items",
  })
  async answers(@Root() question: PostQuestion): Promise<PostAnswer[]> {
    const answers = await PostService.findAllAnswerByQuestionId(question.id);

    return answers;
  }

  @FieldResolver(() => [Tag], {
    description: "해당 글에 속한 태그들",
    nullable: "items",
  })
  async tags(@Root() question: PostQuestion): Promise<Tag[]> {
    const tagIds = await TagService.getAllTagIdsByQuestionId(question.id);
    const tags = await TagService.findTagByIds(tagIds);

    return tags;
  }

  @Query(() => [PostQuestion], {
    description: "인자를 통해 질문글을 검색",
    nullable: "items",
  })
  async searchQuestions(
    @Arg("searchQuery") searchQuery: SearchQuestionInput
  ): Promise<PostQuestion[]> {
    const questions = await PostService.findAllQuestionByArgs(searchQuery);

    return questions;
  }

  @Mutation(() => PostQuestion, { description: "질문글 작성 Mutation" })
  async addNewQuestion(
    @Arg("data") questionData: AddQuestionInput
  ): Promise<PostQuestion> {
    const newQuestion = await PostService.addNewQuestion(questionData, {
      id: 1,
    });

    return newQuestion;
  }
}

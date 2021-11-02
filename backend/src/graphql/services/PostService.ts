import { Like } from "typeorm";
import { PostAnswer } from "../../entities/PostAnswer";
import { PostQuestion } from "../../entities/PostQuestion";
import { PostQuestionHasTag } from "../../entities/PostQuestionHasTag";
import { Tag } from "../../entities/Tag";
import { User } from "../../entities/User";

export default class PostService {
  private static DEFALUT_TAKE_QUESTIONS_COUNT = 20;
  public static async findAllQuestionByArgs(args): Promise<PostQuestion[]> {
    const { author, tags, skip, take } = args;
    const { title, desc, realtime_share } = args;

    const whereObj: any = {};

    if (realtime_share) whereObj.realtimeShare = realtime_share;
    if (title) whereObj.title = Like(`%${title}%`);
    if (desc) whereObj.desc = Like(`%${desc}%`);

    if (author) {
      const user = await User.findOne({ username: author });
      if (user) whereObj.userId = user.id;
      else return [];
    }

    const builder = PostQuestion.createQueryBuilder("Question")
      .where(whereObj)
      .skip(skip ?? 0)
      .take(take ?? this.DEFALUT_TAKE_QUESTIONS_COUNT)
      .orderBy("created_at", "DESC");

    const data = await builder.getMany();

    return data;
  }

  public static async findAllAnswerByArgs(args): Promise<PostAnswer[]> {
    const data = await PostAnswer.find(args);

    return data;
  }

  public static async findOneQuestionById(id): Promise<PostQuestion> {
    const question = await PostQuestion.findOne({ id: id });
    const tags = await PostQuestion.createQueryBuilder("Question")
      .where({ id: id })
      // .leftJoinAndSelect(
      //   "Question.id",
      //   "post_question_has_tag.post_question_id3"
      // )
      .getMany();
    console.log(tags);

    return question;
  }

  // public static async findAllTagByQuesionId(questionId): Promise<Tag[]> {
  //   const tags = await PostQuestion.createQueryBuilder("Question")
  //     .where({ postQuestionId: questionId })
  //     .leftJoinAndSelect("Question.id", "post_question_has_tag")
  //     .getMany();
  //   console.log(tags);
  //   return [];
  // }
}

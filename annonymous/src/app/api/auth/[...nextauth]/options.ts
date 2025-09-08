
//NextAuthOptions  import kr lete hai from next-auth se
import { NextAuthOptions } from 'next-auth';
// CredentialsProvider import kr lete hai from providers/credentials se
import CredentialsProvider from 'next-auth/providers/credentials';
// bcrypt import kr lete hai, password hash wagera krne me easy rahega.
import bcrypt from 'bcryptjs';
// db se bhi connect hona padega, kyuki db me hi to jaakar dekhenge ki user register h ya nahi.
import dbConnect from '@/lib/dbConnect';
// UserModel ka bhi use hoga to import kr lete hai.
import UserModel from '@/model/User';



// authOptions ke variable bana liye hai, and issko export bhi kr diye hai,
// taaki ye route.ts me use kr skke 
// also authOptions ka type NextAuthOptions defined kiye hue hai.
export const authOptions: NextAuthOptions = {
  // NextAuthOptions me providers define kr lete hai, and ye simple 1 array hota hai.
  providers: [
    // ab mujhe jo provider dena hai wo ,mujhe CredentialsProvider dena hai
    // yaha CredentialsProvider jo hai, ye khud me ek method hai.
    CredentialsProvider({
      //ye CredentialsProvider khud me method hai,method ke ander access deta hai kuch objects ka.
      // jaise sabse pehle id id dena hoga.
      // and id hai humara credentials ka name ka.
      id: 'credentials',
      // and name hmara credentials ka name ka h
      name: 'Credentials',
      // and name jo hai wo bhi credentials name ka hi h
      
      // main parameter hai ye credentials, yaha pe hume credentials ka accesss milta hai.
      credentials: {
        // ab hum username ka access kr skte h, and isska label email kr diye h, and type text h
        email: { label: 'Email', type: 'text' },
        // ab hum password ka access kr skte h, and isska label password kr diye h, and type password h
        password: { label: 'Password', type: 'password' },
      },

      // Rule - always aise hi hota hai
      // ab next auth ko nahi pta kaise authorization krna hai.
      // and yaha pe hum async authorize() method ka use krenge.
      // authorize() method ke ander credentials as paramter pass kr diye and type isska any hai
      // aapko jo hai, return me milega promise and isska type any hoga
      //Note: yaha basically, hume creadentials ka access milta hai.
      // and isska use krke hum important value nikal skte hai.
      async authorize(credentials: any): Promise<any> {
        //authorization hum direct nhi kr skte hai, hume db se puchna hoga.
        // to aao db se connect kr lete hai.
        await dbConnect();

        // Db se connect ho gye hai, ab problem aa skti hai. like connect hua and nahi hua 
        // to hum try catch ka use kr lenge.
        try {
          // ab credentials ke ander email or username leke search krna hoga inside db se.
          // Hum, firstly UserModel ka use krenge. and ek method findOne() ka use krenge.
          // and mujhe email and username both leke search krna hoga. 
          // to $or ka use krenge.
          const user = await UserModel.findOne({
            // or operator ka use krenge and isske ander array de dijiye.
            // basically, mujhe either Email or username leke search kr hai user.kaise bhi mujhe user chahiye.
            $or: [
              // ab email and username both leke search krna hoga.
              // email kaise milega? creadentials.identifier likho mil jaayega
              { email: credentials.identifier },
              // username kaise milega? creadentials.identifier likho mil jaayega
              { username: credentials.identifier },
            ],
          });

          // Agar user nahi mila hai to ye error show kr denge
          if (!user) {
            // throw kr diye hai ,error ko.
            throw new Error('No user found with this email');
          }


          // Agar user isVerified nahi hai to ye error show kr denge
          if (!user.isVerified) {
            // throw kr diye hai ,error ko.
            throw new Error('Please verify your account before logging in');
          }

          // ab user mil gya hai, ab password check krna hoga
          // and password check krne ke liye bcrypt ka use krenge
          // and bcrypt.compare() ka use krenge
          // definetly time lagega iss process me to await ka use krenge.
          const isPasswordCorrect = await bcrypt.compare(
            // compare() method ke ander creadentials waala password 
            credentials.password,
            // and user waala password compare kr rahe hai.
            user.password
          );

          //Agar compare krne se password match hua hai to, user return kr denge
          if (isPasswordCorrect) {
            return user;
          } else {
            // Agar password match nahi hua to ye error show kr denge
            throw new Error('Incorrect password');
          }
        }
        // and catch me error ka use krenge 
        catch (err: any) {
          // ye zaruri hai throw krna.
          throw new Error(err);
        }
      },
    }),
  ],



// Always we have to used jwt and session inside "callbacks"
// Chalo hum apna callback start krte hai.

  callbacks: {
    // Note: Ab hum Obejct ke ander hai, so ordereing matter nahi krega.
    // Jwt pehle ho ya baad , no problem 
    
    // Let's start jwt, and humme need hai , token and user se hi hmara kaam ho jaayega.
    // and offcourse ye process hone me time lagega so, async used kr lo.
    
    // Ques ? - Ye user aaya kaha se , so uppar hum  User aise return kr rahe hai. wohi user hai
    // if (isPasswordCorrect) {
    //   return user;

    // User and token, dono jwt ke ander hai means , jwt se hum dono ko access kr skte hai.
    async jwt({ token, user }) {

    // Agar user hai then, then user se data nikal kr hum token ko powerful banaayege.
      if (user) {
        // Ab Target ye h,humara ki hum maximum details add kr de token ke payload m  
        // Ab Token ko powerful banate hai, 
        
        
        // Now, new field bana rahe hai hum _id, and token me value save kr rahe h,
        // and isska value hum user ke id se nikal rahe h, and id ko string me bhi convert kr rahe hai.
        // Note: Yaha ye convert hone me problem ho raha h, so hum aur types define krne honge.
        // So , Let's create 'annonymous\src\types\next-auth.d.ts' File and aao kuch types define krte h
        token._id = user._id?.toString(); // Basically, Convert kr rahe hai, ObjectId se string me
        token.isVerified = user.isVerified;

        //Ab hum token ke ander isAcceptingMessages le rahe h, and isska value user se isAcceptingMessages se aa raha h
        token.isAcceptingMessages = user.isAcceptingMessages;
        // same token ke ander hum username ka value le rahe h, and ye value same user.username waala le rahe h.
        token.username = user.username;
      }

      // 
      return token;
    },

    // Note: Same uppar jo Jwt me value liya woohi sab value idhar bhi lenge.
    // Bacoz- Next-auth jo h na, wo mostly session based hi chalta hai.
    
    // yaaha pe mere pass session ke ander session, and token ka access h.
    async session({ session, token }) {

      //Chalo token le lete hai, jab token hoga then
      if (token) {
        // session ke ander user ka id ka value hum ,same ke lete hai uppar waala.
        // Like - token._id = user._id?.toString(); 
        // To, token._id; pass kr dete hai and value mil jaayega.
        session.user._id = token._id;
        // same like uppar
        session.user.isVerified = token.isVerified;
        // same like uppar
        session.user.isAcceptingMessages = token.isAcceptingMessages; 
        // same like uppar
        session.user.username = token.username;
      }
      // and lastly, return kr diya jo bhi details hai, session ke ander.
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,

  // 
  pages: {
    signIn: '/sign-in',
  },
};

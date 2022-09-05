import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

// mdファイルのデータを取り出す
export function getPostsData () {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // console.log(fileName)
    const id = fileName.replace(/\.md$/, '')  // ファイル名（id）
    
    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const matterResult = matter(fileContents)

    // idとデータを（配列として）返す
    return {
      id,
      ...matterResult.data
    }
  })
  return allPostsData
}

// getStaticPathsでreturnで使うpathを取得する
export function getAllPostIds () {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')  // keyは[id].jsのように[]の中と一致させること。
      }
    }
  })
}

/*
  [
    {
      params: {
        id: "ssg-ssr"
      }
    },
    {
      params: {
        id: "next-react"
      }
    }
  ]
*/

// idに基づいてブログ投稿データを返す
export async function getPostData (id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContent = fs.readFileSync(fullPath, 'utf8')
  
  const matterResult = matter(fileContent)

  const blogContent = await remark()
  .use(html)
  .process(matterResult.content)

  const blogContentHTML = blogContent.toString()
  return {
    id,
    blogContentHTML,
    ...matterResult.data
  }
}

import { BlogPost } from "@/types/blog";

export const posts: BlogPost[] = [
  {
    id: "1",
    title: "Nirvana",
    date: "2025.03.24",
    category: "LIFE",
    slug: "nirvana",
    content: `# Nirvana

개발자로 살아가며 느끼는 일상의 소소한 행복들에 대한 이야기입니다.

코드를 작성하며 마주하는 순간들, 그리고 그 속에서 찾는 평온함에 대해 생각해봅니다.`,
  },
  {
    id: "2",
    title: "React로 인스타그램 필터 구현하기",
    date: "2024.04.26",
    category: "DEV",
    slug: "react-instagram-filter",
    content: `# React로 인스타그램 필터 구현하기

Canvas API와 React를 활용해서 인스타그램 스타일의 이미지 필터를 구현하는 방법을 알아봅시다.`,
  },
  {
    id: "3",
    title: "내가 Tailwind CSS를 사랑하는 이유",
    date: "2024.03.17",
    category: "DEV",
    slug: "why-i-love-tailwind-css",
    content: `# 내가 Tailwind CSS를 사랑하는 이유

유틸리티 퍼스트 CSS 프레임워크인 Tailwind CSS의 매력에 대해 이야기해봅시다.`,
  },
  {
    id: "4",
    title: "2달 동안 커피챗을 20번 해보았다",
    date: "2024.03.03",
    category: "CAREER",
    slug: "coffee-chat-experience",
    content: `# 2달 동안 커피챗을 20번 해보았다

네트워킹의 중요성과 커피챗을 통해 얻은 소중한 경험들을 공유합니다.`,
  },
  {
    id: "5",
    title: "네이티브 도움 없이 웹뷰 간 데이터 동기화하기",
    date: "2024.02.04",
    category: "DEV",
    slug: "webview-data-synchronization",
    content: `# 네이티브 도움 없이 웹뷰 간 데이터 동기화하기

웹뷰 환경에서의 데이터 동기화 방법에 대해 알아봅시다.`,
  },
  {
    id: "6",
    title: "열아홉인데요, 4년차 개발자가 되어버렸습니다",
    date: "2024.01.04",
    category: "CAREER",
    slug: "young-developer-story",
    content: `# 열아홉인데요, 4년차 개발자가 되어버렸습니다

어린 나이에 개발자가 된 이야기와 그 과정에서의 경험들을 나눕니다.`,
  },
];

interface ISiteMetadataResult {
  siteTitle: string;
  siteUrl: string;
  description: string;
  logo: string;
  navLinks: {
    name: string;
    url: string;
  }[];
}

const data: ISiteMetadataResult = {
  siteTitle: "Couture's Running Records",
  siteUrl: 'https://coutures.top',
  logo: 'https://s3.qjqq.cn/50/673067575aa5c.webp!color',
  description: 'Personal site and blog',
  navLinks: [
    {
      name: 'Home',
      url: 'https://coutures.top',
    },
    {
      name: 'Page’s Project',
      url: 'https://github.com/yihong0618/running_page/blob/master/README-CN.md',
    },
  ],
};

export default data;




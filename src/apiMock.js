export const commitsMock = [
  {
    id: "dcab708c589af522c674d34876681c33fd8c3870",
    short_id: "dcab708c",
    title: "Merging Local",
    created_at: "2018-06-07T15:26:32.000+03:00",
    parent_ids: [
      "916c90aab874b8958c8627fbab37f63c0f1d5d20",
      "faf0a0b42bc108b1df5085e229af1c498f8a2042"
    ],
    message: "Merging Local\n",
    author_name: "test user1",
    author_email: "test@gitlab.com",
    authored_date: "2018-06-07T15:26:32.000+03:00",
    committer_name: "test user1",
    committer_email: "test@gitlab.com",
    committed_date: "2018-06-07T15:26:32.000+03:00",
    branch: "dev"
  },
  {
    id: "916c90aab874b8958c8627fbab37f63c0f1d5d20",
    short_id: "916c90aa",
    title: "test title",
    created_at: "2018-06-07T14:57:17.000+03:00",
    parent_ids: ["982035dc6c78c4a4e1d3c68beed0c245906e30bc"],
    message: "test title \n",
    author_name: "test user1",
    author_email: "test@gitlab.com",
    authored_date: "2018-06-07T14:57:17.000+03:00",
    committer_name: "test user1",
    committer_email: "test@gitlab.com",
    committed_date: "2018-06-07T14:57:17.000+03:00",
    branch: "dev"
  },
  {
    id: "faf0a0b42bc108b1df5085e229af1c498f8a2042",
    short_id: "faf0a0b4",
    title: "description in array",
    created_at: "2018-06-07T11:22:36.000+03:00",
    parent_ids: ["c1e2ba16d21281f7e590cea4fb03091d2e029b84"],
    message: "Redmine #5242 - Affiliate API update - description in array\n",
    author_name: "test user2",
    author_email: "test2@gitlab.com",
    authored_date: "2018-06-07T11:22:36.000+03:00",
    committer_name: "test user2",
    committer_email: "test2@gitlab.com",
    committed_date: "2018-06-07T11:22:36.000+03:00",
    branch: "dev"
  },
  {
    id: "020ff1ce5743a730559e5d7b36570b64e4955805",
    short_id: "020ff1ce",
    title: "Merge remote-tracking branch ",
    created_at: "2018-06-07T11:58:23.000+03:00",
    parent_ids: [
      "faf0a0b42bc108b1df5085e229af1c498f8a2042",
      "d2903e690eacb6293ed7910cf99c8d68eb3ea81f"
    ],
    message: "Merge remote-tracking branch 'remo\n",
    author_name: "test user2",
    author_email: "test2@gitlab.com",
    authored_date: "2018-06-07T11:58:23.000+03:00",
    committer_name: "test user2",
    committer_email: "test2@gitlab.com",
    committed_date: "2018-06-07T11:58:23.000+03:00",
    branch: "dev"
  }
];

export const commentMock = [
  {
    note: "fesafsefsg",
    path: "apps/admin/controllers/Controller.php",
    line: 20,
    line_type: "new",
    author: {
      id: 1,
      name: "test user1",
      username: "ttokic",
      state: "active",
      avatar_url:
        "http://gitlab.com/uploads/-/system/user/avatar/30/avatar.png",
      web_url: "http://gitlab.com/tokict"
    },
    created_at: "2018-06-07T12:00:13.455Z",
    branch: "master",
    projectId: 1
  },
  {
    note: "feaf",
    path: "apps/admin/controllers/Controller.php",
    line: 75,
    line_type: null,
    author: {
      id: 2,
      name: "test user2",
      username: "ttokic",
      state: "active",
      avatar_url:
        "http://gitlab.com/uploads/-/system/user/avatar/30/avatar.png",
      web_url: "http://gitlab.com/tokict"
    },
    created_at: "2018-06-07T12:00:18.227Z",
    branch: "master",
    projectId: 2
  }
];

export const mergeRequestsMock = {
  1: [
    {
      id: 12,
      iid: 2,
      project_id: 1,
      title: "Dev",
      description: "",
      state: "merged",
      created_at: "2018-03-23T12:38:40.524Z",
      updated_at: "2018-03-23T12:38:45.277Z",
      target_branch: "master",
      source_branch: "dev",
      upvotes: 0,
      downvotes: 0,
      author: {
        id: 2,
        name: "test user2",
        username: "ttokic",
        state: "active",
        avatar_url:
          "http://gitlab.com/uploads/-/system/user/avatar/30/avatar.png",
        web_url: "http://gitlab.com/tokict"
      },
      assignee: null,
      source_project_id: 54,
      target_project_id: 54,
      labels: [],
      work_in_progress: false,
      milestone: null,
      merge_when_pipeline_succeeds: false,
      merge_status: "can_be_merged",
      sha: "55ca660bd2b4d6022475eb78b40bb0a783d00c6a",
      merge_commit_sha: "ac4d43e5a58985858f95ea0f9ab1b4e385d61174",
      user_notes_count: 0,
      discussion_locked: null,
      should_remove_source_branch: null,
      force_remove_source_branch: false,
      web_url: "http://gitlab.com/test/merge_requests/2",
      time_stats: {
        time_estimate: 0,
        total_time_spent: 0,
        human_time_estimate: null,
        human_total_time_spent: null
      }
    }
  ],

  2: [
    {
      id: 11,
      iid: 1,
      project_id: 2,
      title: "Dev",
      description: "",
      state: "merged",
      created_at: "2018-03-20T15:46:12.766Z",
      updated_at: "2018-03-22T15:53:51.633Z",
      target_branch: "master",
      source_branch: "dev",
      upvotes: 0,
      downvotes: 0,
      author: {
        id: 1,
        name: "test user1",
        username: "ttokic",
        state: "active",
        avatar_url:
          "http://gitlab.com/uploads/-/system/user/avatar/30/avatar.png",
        web_url: "http://gitlab.com/tokict"
      },
      assignee: null,
      source_project_id: 54,
      target_project_id: 54,
      labels: [],
      work_in_progress: false,
      milestone: null,
      merge_when_pipeline_succeeds: false,
      merge_status: "can_be_merged",
      sha: "03e9fea9f2a982bcafa36ac8d25e222b78835187",
      merge_commit_sha: "db97f8cf98c4931d3d28f42f832d46e5d54375b1",
      user_notes_count: 0,
      discussion_locked: null,
      should_remove_source_branch: null,
      force_remove_source_branch: false,
      web_url: "http://gitlab.com/test/merge_requests/1",
      time_stats: {
        time_estimate: 0,
        total_time_spent: 0,
        human_time_estimate: null,
        human_total_time_spent: null
      }
    }
  ]
};

export const projectsMock = [
  {
    id: 1,
    description: "test Calculator",
    name: "calculator",
    name_with_namespace: "test / calculator",
    path: "calculator",
    path_with_namespace: "test/calculator",
    created_at: "2018-06-06T11:53:50.051Z",
    default_branch: "master",
    tag_list: [],
    ssh_url_to_repo: "git@gitlab.com:test/calculator.git",
    http_url_to_repo: "http://gitlab.com/test/calculator.git",
    web_url: "http://gitlab.com/test/calculator",
    avatar_url: null,
    star_count: 0,
    forks_count: 0,
    last_activity_at: "2018-06-06T11:53:50.051Z",
    _links: {
      self: "http://gitlab.com/api/v4/projects/57",
      issues: "http://gitlab.com/api/v4/projects/57/issues",
      merge_requests: "http://gitlab.com/api/v4/projects/57/merge_requests",
      repo_branches: "http://gitlab.com/api/v4/projects/57/repository/branches",
      labels: "http://gitlab.com/api/v4/projects/57/labels",
      events: "http://gitlab.com/api/v4/projects/57/events",
      members: "http://gitlab.com/api/v4/projects/57/members"
    },
    archived: false,
    visibility: "internal",
    resolve_outdated_diff_discussions: false,
    container_registry_enabled: true,
    issues_enabled: true,
    merge_requests_enabled: true,
    wiki_enabled: true,
    jobs_enabled: true,
    snippets_enabled: true,
    shared_runners_enabled: true,
    lfs_enabled: true,
    creator_id: 14,
    namespace: {
      id: 58,
      name: "test",
      path: "test",
      kind: "group",
      full_path: "test",
      parent_id: null
    },
    import_status: "none",
    open_issues_count: 0,
    public_jobs: true,
    ci_config_path: null,
    shared_with_groups: [],
    only_allow_merge_if_pipeline_succeeds: false,
    request_access_enabled: false,
    only_allow_merge_if_all_discussions_are_resolved: false,
    printing_merge_request_link_enabled: true,
    statistics: {
      commit_count: 1,
      storage_size: 83886,
      repository_size: 83886,
      lfs_objects_size: 0,
      job_artifacts_size: 0
    },
    permissions: { project_access: null, group_access: null }
  },
  {
    id: 2,
    description: "Bulgarian site",
    name: "bg",
    name_with_namespace: "sites / bg",
    path: "bg",
    path_with_namespace: "test",
    created_at: "2018-03-14T14:45:07.688Z",
    default_branch: "master",
    tag_list: [],
    ssh_url_to_repo: "git@gitlab.com:test.git",
    http_url_to_repo: "http://gitlab.com/test.git",
    web_url: "http://gitlab.com/test",
    avatar_url:
      "http://gitlab.com/uploads/-/system/project/avatar/55/bg_flag.jpg",
    star_count: 0,
    forks_count: 0,
    last_activity_at: "2018-06-07T12:00:13.548Z",
    _links: {
      self: "http://gitlab.com/api/v4/projects/55",
      issues: "http://gitlab.com/api/v4/projects/55/issues",
      merge_requests: "http://gitlab.com/api/v4/projects/55/merge_requests",
      repo_branches: "http://gitlab.com/api/v4/projects/55/repository/branches",
      labels: "http://gitlab.com/api/v4/projects/55/labels",
      events: "http://gitlab.com/api/v4/projects/55/events",
      members: "http://gitlab.com/api/v4/projects/55/members"
    },
    archived: false,
    visibility: "internal",
    resolve_outdated_diff_discussions: false,
    container_registry_enabled: true,
    issues_enabled: true,
    merge_requests_enabled: true,
    wiki_enabled: true,
    jobs_enabled: true,
    snippets_enabled: true,
    shared_runners_enabled: true,
    lfs_enabled: true,
    creator_id: 30,
    namespace: {
      id: 53,
      name: "sites",
      path: "sites",
      kind: "group",
      full_path: "sites",
      parent_id: null
    },
    import_status: "none",
    open_issues_count: 0,
    public_jobs: true,
    ci_config_path: null,
    shared_with_groups: [],
    only_allow_merge_if_pipeline_succeeds: true,
    request_access_enabled: true,
    only_allow_merge_if_all_discussions_are_resolved: false,
    printing_merge_request_link_enabled: true,
    statistics: {
      commit_count: 2691,
      storage_size: 79712747,
      repository_size: 79712747,
      lfs_objects_size: 0,
      job_artifacts_size: 0
    },
    permissions: {
      project_access: null,
      group_access: { access_level: 50, notification_level: 3 }
    }
  }
];

export const usersMock = [
  {
    id: 1,
    name: "test user1",
    username: "test user1",
    state: "active",
    avatar_url: null,
    web_url: "http://gitlab.com/test1"
  },
  {
    id: 2,
    name: "test user2",
    username: "test user2",
    state: "active",
    avatar_url: null,
    web_url: "http://gitlab.com/test2"
  },
  {
    id: 3,
    name: "test user3",
    username: "test user3",
    state: "active",
    avatar_url: null,
    web_url: "http://gitlab.com/test3"
  },
  {
    id: 4,
    name: "test user4",
    username: "test user4",
    state: "active",
    avatar_url: null,
    web_url: "http://gitlab.com/test4"
  }
];

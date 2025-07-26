<template>
  <div class="p-4">
    <el-card>
      <template #header>{{ id ? '编辑活动' : '新建活动' }}</template>
      <el-form :model="form" label-width="80">
        <el-form-item label="名称"><el-input v-model="form.title"/></el-form-item>
        <el-form-item label="开始"><el-date-picker v-model="form.startTime" type="datetime"/></el-form-item>
        <el-form-item label="结束"><el-date-picker v-model="form.endTime" type="datetime"/></el-form-item>
        <el-form-item label="地点"><el-input v-model="form.location"/></el-form-item>
        <el-form-item label="名额"><el-input-number v-model="form.quota" :min="1"/></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.desc" type="textarea"/></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="online">上线</el-radio>
            <el-radio value="offline">下线</el-radio>
            <el-radio value="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createActivity, getActivity, updateActivity } from '@/services/activity';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const form = ref({
  title: '',
  startTime: '',
  endTime: '',
  location: '',
  quota: 10,
  desc: '',
  status: 'draft'
});

const load = async () => {
  if (!id) return;
  const { data } = await getActivity(id);
  Object.assign(form.value, data);
};

const submit = async () => {
  id ? await updateActivity(id, form.value) : await createActivity(form.value);
  await router.replace('/activities');
};

onMounted(load);
</script>
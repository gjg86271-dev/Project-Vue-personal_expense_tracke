import { ref } from "vue";
import { defineStore } from "pinia";
import api from "@/api/api";

export const useGoalsStore =
  defineStore("goals", () => {
    const goals = ref([]);

    /* =========================
       FETCH GOALS
    ========================= */
    async function fetchAllGoals() {
      try {
        const response =
          await api.get(
            "goals?_page=1&_per_page=10"
          );

        goals.value =
          response.data.data.items;

        console.log(
          "Fetched goals:",
          goals.value
        );
      } catch (error) {
        console.log(error);
      }
    }

    /* =========================
       CREATE GOAL
    ========================= */
    async function createGoal(
      goalData
    ) {
      try {
        const response =
          await api.post(
            "/goals",
            goalData
          );

        goals.value.push(
          response.data.data
        );

        console.log(
          "Created:",
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    }

    /* =========================
       UPDATE GOAL
    ========================= */ 
/* =========================
   UPDATE GOAL
========================= */
async function updateGoal(
  goalId,
  updatedData
) {
  try {
    const response =
      await api.put(
        `/goals/${goalId}`,
        {
          name:
            updatedData.name,

          targetAmount: Number(
            updatedData.targetAmount
          ),

          deadline:
            updatedData.deadline,
        }
      );

    const index =
      goals.value.findIndex(
        (goal) =>
          goal.id === goalId
      );

    if (index !== -1) {
      goals.value[index] =
        response.data.data;
    }

    console.log(
      "Updated:",
      response.data
    );
  } catch (error) {
    console.log(
      "Update error:",
      error
    );
  }
}
    /* =========================
       DELETE GOAL
    ========================= */
    async function deleteGoal(
      goalId
    ) {
      try {
        await api.delete(
          `/goals/${goalId}`
        );

        goals.value =
          goals.value.filter(
            (goal) =>
              goal.id !== goalId
          );
      } catch (error) {
        console.log(error);
      }
    }

    /* =========================
       ADD PROGRESS
    ========================= */
    async function addGoalProgress(
      goalId,
      amount
    ) {
      try {
        const response =
          await api.put(
            `/goals/${goalId}/progress`,
            {
              amount:
                Number(amount),
            }
          );

        console.log(
          "Progress added:",
          response.data
        );

        return response.data;
      } catch (error) {
        console.log(error);
      }
    }

    return {
      goals,
      fetchAllGoals,
      createGoal,
      updateGoal,
      deleteGoal,
      addGoalProgress,
    };
  });
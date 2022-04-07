using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LoadingScreenAnimation : MonoBehaviour
{

    private Animator anim;

    private void Start()
    {
        this.anim = GetComponent<Animator>();
    }

    public void fadeIn()
    {
        anim.Play("LoadingScreenFadeIn");
    }
}

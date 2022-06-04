using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HideCard : MonoBehaviour
{

    private Animator anim;

    private void Awake()
    {
        anim = GetComponent<Animator>();
    }

    public void OnHideExtraCardFinishAnimation()
    {
        gameObject.SetActive(false);
    }

    public void OnHideExtraCardClick()
    {
        anim.Play("PlanetExtraDisappear");
    }

    private void OnEnable()
    {
        anim.Play("PlanetExtraAppear");
    }
}
